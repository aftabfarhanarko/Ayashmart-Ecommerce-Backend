import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource, IsNull } from "typeorm";
import { randomBytes } from "crypto";
import { Order } from "./entities/order.entity";
import { OrderStatusHistory } from "./entities/order-status-history.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { ProductEntity } from "../products/entities/product.entity";
import { User } from "../users/entities/user.entity";
import { PaymentsService } from "../payments/payments.service";
import { Inject, forwardRef } from "@nestjs/common";
import { VoiceService } from "../voice/voice.service";
import { NotificationsService } from "../notifications/notifications.service";
import {
  generateOrderPlacedEmail,
  generateOrderProcessingEmail,
  generateOrderShippedEmail,
  generateOrderDeliveredEmail,
} from "../common/templates/order-status-email.templates";
import { ActivityLogService } from "../systemuser/activity-log.service";
import { ActivityAction, ActivityEntity } from "../systemuser/entities/activity-log.entity";
import { SystemuserService } from "../systemuser/systemuser.service";


@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderStatusHistory) private statusHistoryRepo: Repository<OrderStatusHistory>,
    @InjectRepository(ProductEntity) private productRepo: Repository<ProductEntity>,
    @InjectRepository(User) private userRepo: Repository<User>,

    private dataSource: DataSource,
    private readonly paymentsService: PaymentsService,
    private readonly notificationsService: NotificationsService,
    private readonly activityLogService: ActivityLogService,
    private readonly systemuserService: SystemuserService,
    @Inject('MAILER_TRANSPORT')
    private readonly mailer: { sendMail: (message: unknown) => Promise<{ id?: string }> },
    @Inject(forwardRef(() => VoiceService))
    private readonly voiceService: VoiceService,
  ) {}

  /** Save status change to history for tracking timeline */
  private async addStatusHistory(
    orderId: number,
    previousStatus: string | null,
    newStatus: string,
    comment?: string,
  ): Promise<void> {
    try {
      const history = new OrderStatusHistory();
      history.orderId = orderId;
      history.previousStatus = previousStatus ?? undefined;
      history.newStatus = newStatus;
      history.comment = comment;
      await this.statusHistoryRepo.save(history);
    } catch (err) {
      console.error("[OrderService] Failed to save status history:", {
        orderId,
        previousStatus,
        newStatus,
        error: err instanceof Error ? err.message : String(err),
      });
      // Don't throw - allow order update to succeed; history is for tracking display
    }
  }

  // Create order: will check stock and reserve (atomic transaction)
  async create(createDto: CreateOrderDto, companyId: string, performedByUserId?: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    let transactionStarted = false;
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      transactionStarted = true;
      let customer: User | null = null;
      if (typeof createDto.customerId === "number") {
        customer = await this.userRepo.findOneBy({ id: createDto.customerId, companyId });
        if (!customer) throw new NotFoundException("Customer not found");
        if (customer.isBanned) {
          throw new BadRequestException("Your account has been banned. You cannot create orders.");
        }
      } else if (createDto.customerEmail?.trim()) {
        const email = createDto.customerEmail.trim();
        // Try to find existing customer by email for this company
        let userByEmail = await this.userRepo.findOne({
          where: { email, companyId },
        });

        if (userByEmail) {
          // Existing customer: block if banned, otherwise use this customer
          if (userByEmail.isBanned) {
            throw new BadRequestException("Your account has been banned. You cannot create orders.");
          }

          customer = userByEmail;
        } else {
          // No existing customer: create lightweight customer account automatically (no login required)
          const newCustomer = this.userRepo.create({
            name: createDto.customerName ?? "",
            email,
            phone: createDto.customerPhone ?? "",
            address: createDto.shippingAddress ?? createDto.customerAddress ?? "",
            role: "customer",
            isActive: true,
            companyId,
          });

          customer = await this.userRepo.save(newCustomer);
        }
      }

      const order = new Order();
      order.customer = customer ?? undefined;
      order.customerName = customer?.name ?? createDto.customerName ?? "";
      order.customerPhone = customer?.phone ?? createDto.customerPhone ?? "";
      order.customerEmail = customer?.email ?? createDto.customerEmail ?? undefined;
      // Use shippingAddress if provided, otherwise use customerAddress or customer's address
      order.customerAddress = createDto.shippingAddress ?? customer?.address ?? createDto.customerAddress ?? "";
      // Save any additional order information (e.g. tShirtSize from storefront)
      order.orderInfo = createDto.orderInfo ?? undefined;
      order.status = "pending";
      order.paymentMethod = createDto.paymentMethod ?? "DIRECT";
      order.deliveryType = createDto.deliveryType ?? "INSIDEDHAKA";
      order.companyId = companyId;



    

      const items: Array<{
        productId: number;
        resellerId?: number;
        product?: {
          id: number;
          name: string;
          sku?: string;
          images?: Array<{ url: string; isPrimary?: boolean }>;
        };
        quantity: number;
        unitPrice: number;
        totalPrice: number;
      }> = [];
      let total = 0;

      for (const it of createDto.items) {
        const product = await this.productRepo.findOne({ 
          where: { 
            id: it.productId, 
            companyId,
            deletedAt: IsNull()
          }
        });
        if (!product) throw new NotFoundException(`Product ${it.productId} not found`);

        // Check stock from product inventory
        if (product.stock < it.quantity) {
          throw new BadRequestException(`Insufficient stock for product ${product.id}. Available: ${product.stock}, Requested: ${it.quantity}`);
        }
        
        // Reserve stock by decreasing it
        product.stock -= it.quantity;
        await queryRunner.manager.save(product);

        // Use discountPrice if available, otherwise use price
        const finalPrice = product.discountPrice || product.price;

        const itemData = {
          productId: product.id,
          resellerId: product.resellerId ?? undefined,
          product: {
            id: product.id,
            name: product.name,
            sku: product.sku,
            images: product.images?.map(img => ({
              url: img.url,
              isPrimary: img.isPrimary
            })) || []
          },
          quantity: it.quantity,
          unitPrice: +finalPrice,
          totalPrice: +finalPrice * it.quantity,
        };

        total += itemData.totalPrice;
        items.push(itemData);
      }

      order.items = items;
      order.totalAmount = total;

      const savedOrder = await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
      transactionStarted = false; // Transaction committed, don't try to rollback

      await this.addStatusHistory(savedOrder.id, null, "pending");

      const fullOrder = await this.orderRepo.findOne({
        where: { id: savedOrder.id, companyId },
        relations: ["customer"],
      });

      const customerAddress = fullOrder?.customerAddress ?? "";
      let payment: any = null;
      
      // Payment initiation happens after transaction commit
      // If it fails, we can't rollback, but order is already saved
      try {
        if (fullOrder!.paymentMethod === "DIRECT") {
          payment = await this.paymentsService.initiateSslPayment({
            amount: fullOrder ? +fullOrder.totalAmount : 0,
            currency: "BDT",
            orderId: fullOrder!.id.toString(),
            customerName: fullOrder!.customer?.name ?? fullOrder!.customerName ?? "",
            customerEmail: fullOrder!.customer?.email ?? "",
            customerPhone: fullOrder!.customer?.phone ?? fullOrder!.customerPhone ?? "",
            customerAddress,
          });
        }
      } catch (paymentErr) {
        // Log payment error but don't fail the order creation
        // Order is already saved, payment can be initiated later
        console.error('Error initiating payment:', paymentErr);
        // Continue without payment - order is still created
      }

      // Send notifications to owner after successful order creation
      try {
        await this.sendOwnerNotifications(createDto, fullOrder!);
      } catch (notificationErr) {
        // Log notification error but don't fail the order creation
        console.error('Error sending notifications:', notificationErr);
        // Continue - order is still created
      }

      // Check for low stock / out of stock after order creation (stock was decremented)
      try {
        const LOW_STOCK_THRESHOLD = +(process.env.LOW_STOCK_THRESHOLD ?? 5);
        for (const it of fullOrder!.items ?? []) {
          const product = await this.productRepo.findOne({
            where: { id: it.productId, companyId },
          });
          if (!product) continue;
          product.isLowStock = product.stock <= LOW_STOCK_THRESHOLD;
          await this.productRepo.save(product);
          if (product.isLowStock) {
            await this.sendLowStockEmail(product);
          }
        }
      } catch (stockNotifyErr) {
        console.error('Error checking low stock after order:', stockNotifyErr);
      }

      // Send order confirmation email to customer
      try {
        await this.sendOrderStatusEmail(fullOrder!, "placed");
      } catch (emailErr) {
        console.error('Error sending order confirmation email:', emailErr);
      }

      if (performedByUserId && fullOrder) {
        try {
          await this.activityLogService.logActivity({
            companyId,
            action: ActivityAction.CREATE,
            entity: ActivityEntity.ORDER,
            entityId: fullOrder.id,
            entityName: `Order #${fullOrder.id}`,
            description: `Created order #${fullOrder.id} - ${fullOrder.customerName || 'Customer'}`,
            newValues: { orderId: fullOrder.id, status: fullOrder.status, totalAmount: fullOrder.totalAmount },
            performedByUserId,
          });
        } catch (e) {
          console.error('Failed to log activity:', e);
        }
      }

      // Determine customer phone and trigger IVR call asynchronously
      const phoneToCall = fullOrder?.customerPhone || fullOrder?.customer?.phone;
      if (phoneToCall && fullOrder) {
        this.voiceService.makeOrderConfirmationCall(phoneToCall, fullOrder.id, companyId)
          .catch(e => console.error('Failed to trigger IVR confirmation call:', e));
      }

      return { order: fullOrder, payment };
    } catch (err) {
      // Only rollback if transaction was started
      if (transactionStarted) {
        try {
          await queryRunner.rollbackTransaction();
        } catch (rollbackErr) {
          // Log rollback error but don't mask the original error
          // This can happen if transaction was already committed/rolled back
          console.error('Error during transaction rollback:', rollbackErr);
        }
      }
      throw err;
    } finally {
      // Always release the query runner
      try {
        if (!queryRunner.isReleased) {
          await queryRunner.release();
        }
      } catch (releaseErr) {
        // Log but don't throw - query runner might already be released
        console.error('Error releasing query runner:', releaseErr);
      }
    }
  }

  async createIncomplete(createDto: CreateOrderDto, companyId: string, orderId?: number) {
    let order: Order | null = null;
    if (orderId) {
      order = await this.orderRepo.findOne({ where: { id: orderId, companyId, status: "incomplete" } });
    }
    
    if (!order) {
      order = new Order();
    }

    order.customerName = createDto.customerName ?? order.customerName;
    order.customerPhone = createDto.customerPhone ?? order.customerPhone;
    order.customerEmail = createDto.customerEmail ?? order.customerEmail;
    order.customerAddress = createDto.shippingAddress ?? createDto.customerAddress ?? order.customerAddress;
    order.orderInfo = createDto.orderInfo ?? order.orderInfo;
    order.status = "incomplete";
    order.paymentMethod = createDto.paymentMethod ?? order.paymentMethod ?? "COD";
    order.deliveryType = createDto.deliveryType ?? order.deliveryType ?? "INSIDEDHAKA";
    order.companyId = companyId;

    const items: any[] = [];
    let total = 0;

    for (const it of (createDto.items || [])) {
      const product = await this.productRepo.findOne({ 
        where: { id: it.productId, companyId, deletedAt: IsNull() }
      });
      if (product) {
        const finalPrice = product.discountPrice || product.price;
        const itemData = {
          productId: product.id,
          resellerId: product.resellerId ?? undefined,
          product: {
            id: product.id,
            name: product.name,
            sku: product.sku,
            images: product.images?.map(img => ({ url: img.url, isPrimary: img.isPrimary })) || []
          },
          quantity: it.quantity,
          unitPrice: +finalPrice,
          totalPrice: +finalPrice * it.quantity,
        };
        total += itemData.totalPrice;
        items.push(itemData);
      }
    }

    order.items = items;
    order.totalAmount = total;

    return this.orderRepo.save(order);
  }

  async convertToRealOrder(id: number, companyId: string, performedByUserId?: number) {
    const order = await this.orderRepo.findOne({
      where: { id, companyId, status: "incomplete" },
      relations: ["customer"]
    });
    if (!order) throw new NotFoundException("Incomplete order not found");

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Reserve stock
      for (const it of order.items) {
        const product = await queryRunner.manager.findOne(ProductEntity, {
          where: { id: it.productId, companyId, deletedAt: IsNull() }
        });
        if (!product) throw new NotFoundException(`Product ${it.productId} not found`);
        if (product.stock < it.quantity) {
          throw new BadRequestException(`Insufficient stock for product ${product.name}`);
        }
        product.stock -= it.quantity;
        await queryRunner.manager.save(product);
      }

      // 2. Update status
      order.status = "pending";
      const savedOrder = await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();

      await this.addStatusHistory(savedOrder.id, "incomplete", "pending", "Converted from incomplete order");

      // 3. Trigger notifications (similar to create)
      const fullOrder = await this.orderRepo.findOne({
        where: { id: savedOrder.id, companyId },
        relations: ["customer"]
      });

      if (fullOrder) {
        try {
          const createDto: CreateOrderDto = {
            customerName: fullOrder.customerName,
            customerPhone: fullOrder.customerPhone,
            customerEmail: fullOrder.customerEmail,
            items: fullOrder.items.map(it => ({ productId: it.productId, quantity: it.quantity })),
            shippingAddress: fullOrder.customerAddress,
            deliveryType: fullOrder.deliveryType,
            paymentMethod: fullOrder.paymentMethod,
          };
          await this.sendOwnerNotifications(createDto, fullOrder);
          await this.sendOrderStatusEmail(fullOrder, "placed");
        } catch (e) {
          console.error("Failed to send conversion notifications:", e);
        }

        if (performedByUserId) {
          await this.activityLogService.logActivity({
            companyId,
            action: ActivityAction.STATUS_CHANGE,
            entity: ActivityEntity.ORDER,
            entityId: fullOrder.id,
            entityName: `Order #${fullOrder.id}`,
            description: `Converted incomplete order #${fullOrder.id} to real order`,
            oldValues: { status: "incomplete" },
            newValues: { status: "pending" },
            performedByUserId,
          });
        }
      }

      return fullOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(companyId: string, resellerId?: number) {
    const orders = await this.orderRepo.find({
      where: {
        companyId,
        deletedAt: IsNull(), // Only get non-deleted orders
      },
      relations: ["customer"],
      order: { createdAt: 'DESC' },
    });

    if (!resellerId) {
      return orders;
    }

    // For reseller view: only show orders that contain at least one of their products,
    // and within those orders, only expose their own line items.
    return orders
      .map((o) => {
        const ownItems = (o.items || []).filter(
          (it) => it.resellerId === resellerId,
        );
        if (ownItems.length === 0) return null;

        const clone = { ...o };
        clone.items = ownItems;
        return clone;
      })
      .filter(Boolean) as Order[];
  }

  async getStats(companyId: string) {
    const orders = await this.orderRepo.find({
      where: { companyId, deletedAt: IsNull() },
    });

    const total = orders.length;
    const pending = orders.filter((o) => (o.status?.toLowerCase() || "") === "pending").length;
    const processing = orders.filter((o) => (o.status?.toLowerCase() || "") === "processing").length;
    const paid = orders.filter((o) => (o.status?.toLowerCase() || "") === "paid").length;
    const shipped = orders.filter((o) => (o.status?.toLowerCase() || "") === "shipped").length;
    const delivered = orders.filter((o) => (o.status?.toLowerCase() || "") === "delivered").length;
    const cancelled = orders.filter((o) => (o.status?.toLowerCase() || "") === "cancelled").length;
    const refunded = orders.filter((o) => (o.status?.toLowerCase() || "") === "refunded").length;
    const incomplete = orders.filter((o) => (o.status?.toLowerCase() || "") === "incomplete").length;

    const paidOrders = orders.filter(
      (o) => o.isPaid || o.status === "paid" || o.status === "delivered",
    );
    const totalRevenue = paidOrders.reduce(
      (sum, o) => sum + Number(o.totalAmount || 0),
      0,
    );
    const unpaidCount = orders.filter((o) => !o.isPaid && o.status !== "cancelled" && o.status !== "refunded" && o.status !== "incomplete").length;

    return {
      total,
      pending,
      processing,
      paid,
      shipped,
      delivered,
      cancelled,
      refunded,
      incomplete,
      totalRevenue,
      unpaidCount,
    };
  }

  async findByCustomerId(customerId: number, companyId: string) {
    return this.orderRepo.find({ 
      where: { 
        customer: { id: customerId },
        companyId,
        deletedAt: IsNull() // Only get non-deleted orders
      },
      relations: ["customer"],
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Find order by tracking number (shippingTrackingId).
   * Public API - returns order status and full status history for customer tracking.
   * Searches across all companies (tracking numbers are typically unique).
   */
  async findByTrackingId(trackingId: string) {
    const trimmed = (trackingId || "").trim();
    if (!trimmed) throw new BadRequestException("Tracking number is required");

    const order = await this.orderRepo.findOne({
      where: {
        shippingTrackingId: trimmed,
        deletedAt: IsNull(),
      },
      relations: ["customer"],
    });

    if (!order) throw new NotFoundException("Order not found for this tracking number");

    let statusHistory = await this.statusHistoryRepo.find({
      where: { orderId: order.id },
      order: { createdAt: "ASC" },
    });

    // Backfill for orders created before status history feature - add initial pending
    if (statusHistory.length === 0 && order.createdAt) {
      statusHistory = [
        {
          id: 0,
          orderId: order.id,
          previousStatus: undefined,
          newStatus: order.status,
          comment: undefined,
          createdAt: order.createdAt,
        } as OrderStatusHistory,
      ];
    }

    const statusMessages: Record<string, string> = {
      pending: "Your order has been received and is awaiting confirmation.",
      processing: "Your order is being prepared for shipment.",
      paid: "Payment received. Your order is being processed.",
      shipped: "Your order has been shipped and is on its way.",
      delivered: "Your order has been delivered successfully.",
      cancelled: "This order has been cancelled.",
      refunded: "This order has been refunded.",
    };
    const message = statusMessages[order.status] ?? "Your order status is being updated.";

    // Return sanitized tracking response with full status history (no sensitive customer data)
    return {
      orderId: order.id,
      status: order.status,
      message,
      trackingId: order.shippingTrackingId,
      shippingProvider: order.shippingProvider,
      deliveryType: order.deliveryType,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      statusHistory,
      items: order.items?.map((it) => ({
        name: it.product?.name ?? "Product",
        quantity: it.quantity,
      })) ?? [],
    };
  }

  async findOne(id: number, companyId: string) {
    const o = await this.orderRepo.findOne({ 
      where: { 
        id, 
        companyId,
        deletedAt: IsNull() // Only get non-deleted orders
      }, 
      relations: ["customer"] 
    });
    if (!o) throw new NotFoundException("Order not found");
    return o;
  }

  /**
   * Record barcode scan for inventory management.
   * When merchants scan the parcel slip barcode with a barcode scanner:
   * - Finds order by tracking ID (company-scoped)
   * - Logs activity in the panel (history stored)
   * - Stock is already deducted at order creation; this records the scan event for audit/warehouse flow
   */
  async recordBarcodeScan(trackingId: string, companyId: string, performedByUserId?: number) {
    const trimmed = (trackingId || "").trim();
    if (!trimmed) throw new BadRequestException("Tracking number is required");

    const order = await this.orderRepo.findOne({
      where: {
        shippingTrackingId: trimmed,
        companyId,
        deletedAt: IsNull(),
      },
      relations: ["customer"],
    });

    if (!order) throw new NotFoundException("Order not found for this tracking number");

    if (performedByUserId) {
      try {
        await this.activityLogService.logActivity({
          companyId,
          action: ActivityAction.BARCODE_SCAN,
          entity: ActivityEntity.ORDER,
          entityId: order.id,
          entityName: `Order #${order.id}`,
          description: `Barcode scanned for order #${order.id} - Tracking: ${trimmed}`,
          oldValues: {},
          newValues: { trackingId: trimmed, orderId: order.id },
          performedByUserId,
        });
      } catch (e) {
        console.error("Failed to log barcode scan:", e);
      }
    }

    return { orderId: order.id, trackingId: trimmed, message: "Barcode scan recorded" };
  }

  // mark as completed (paid & completed) => update inventory.sold
  async completeOrder(id: number, companyId: string, paymentRef?: string, performedByUserId?: number) {
    const order = await this.findOne(id, companyId);
    if (!order) throw new NotFoundException("Order not found");
    if (order.status === "cancelled") throw new BadRequestException("Order cancelled");
    const previousStatus = order.status;

    await this.addStatusHistory(order.id, order.status, "paid");
    order.isPaid = true;
    order.paidAmount = Number(order.totalAmount);
    order.paymentReference = paymentRef ?? undefined;
    order.status = "paid";
    await this.orderRepo.save(order);

    // increment sold counters in product inventory
    for (const it of order.items) {
      const product = await this.productRepo.findOne({ 
        where: { id: it.productId, companyId } 
      });
      if (product) {
        product.sold += it.quantity;
        // stock already decreased on create (reservation)
        await this.productRepo.save(product);
      }
    }

    if (performedByUserId) {
      try {
        await this.activityLogService.logActivity({
          companyId,
          action: ActivityAction.STATUS_CHANGE,
          entity: ActivityEntity.ORDER,
          entityId: order.id,
          entityName: `Order #${order.id}`,
          description: `Order #${order.id} marked as paid/completed`,
          oldValues: { status: previousStatus },
          newValues: { status: 'paid' },
          performedByUserId,
        });
      } catch (e) {
        console.error('Failed to log activity:', e);
      }
    }

    return this.findOne(id, companyId);
  }

  // cancel: restore stock
  async cancelOrder(id: number, companyId: string, comment?: string, performedByUserId?: number) {
    const order = await this.findOne(id, companyId);
    const previousStatus = order.status;

    // For customer dashboard: only allow cancel within 24 hours.
    // For admin/system users (performedByUserId is set), allow cancel anytime.
    if (!performedByUserId) {
      const created = new Date(order.createdAt);
      const now = new Date();
      const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
      if (hoursDiff > 24) {
        throw new BadRequestException("Order can only be cancelled within 24 hours of placement");
      }
    }

    if (order.status === "cancelled") throw new BadRequestException("Already cancelled");
    if (order.status === "refunded") throw new BadRequestException("Already refunded");

    await this.addStatusHistory(order.id, order.status, "cancelled", comment);
    order.status = "cancelled";
    if (comment) {
      order.cancelNote = comment;
    }
    await this.orderRepo.save(order);

    for (const it of order.items) {
      const product = await this.productRepo.findOne({
        where: { id: it.productId, companyId },
      });
      if (product) {
        product.stock += it.quantity;
        if (product.sold >= it.quantity) {
          product.sold -= it.quantity;
        }
        await this.productRepo.save(product);
      }
    }

    // increment user's cancelledOrdersCount if customer exists; auto-ban if cancel ratio >= 95%
    if (order.customer?.id) {
      const user = await this.userRepo.findOne({ 
        where: { id: order.customer.id, companyId } 
      });
      if (user) {
        user.cancelledOrdersCount = (user.cancelledOrdersCount ?? 0) + 1;
        await this.userRepo.save(user);

        // Auto-ban if cancel ratio >= 95%
        const total = (user.successfulOrdersCount ?? 0) + user.cancelledOrdersCount;
        if (total >= 1 && !user.isBanned) {
          const cancelRatio = user.cancelledOrdersCount / total;
          if (cancelRatio >= 0.95) {
            user.isBanned = true;
            user.bannedAt = new Date();
            user.banReason = "Auto-banned: cancel ratio exceeds 95%";
            await this.userRepo.save(user);
          }
        }
      }
    }

    if (performedByUserId) {
      try {
        await this.activityLogService.logActivity({
          companyId,
          action: ActivityAction.STATUS_CHANGE,
          entity: ActivityEntity.ORDER,
          entityId: order.id,
          entityName: `Order #${order.id}`,
          description: `Order #${order.id} cancelled`,
          oldValues: { status: previousStatus },
          newValues: { status: 'cancelled' },
          performedByUserId,
        });
      } catch (e) {
        console.error('Failed to log activity:', e);
      }
    }

    return { message: "Order cancelled" };
  }

  /**
   * Generate a unique internal tracking ID when order moves to processing.
   * Format: SC-{orderId}-{randomHex(4)} e.g. SC-12345-A1B2
   */
  private generateTrackingId(orderId: number): string {
    const suffix = randomBytes(4).toString("hex").toUpperCase();
    return `SC-${orderId}-${suffix}`;
  }

  async processOrder(id: number, companyId: string, performedByUserId?: number) {
    const order = await this.findOne(id, companyId);
    if (!order) throw new NotFoundException("Order not found");
    if (order.status === "cancelled") throw new BadRequestException("Order cancelled");
    if (order.status === "processing") throw new BadRequestException("Order is already being processed");

    await this.addStatusHistory(order.id, order.status, "processing");
    order.status = "processing";
    // Auto-generate internal tracking ID so customers can track before courier shipment
    if (!order.shippingTrackingId) {
      order.shippingTrackingId = this.generateTrackingId(order.id);
      // If no explicit courier set, treat as own/merchant delivery
      order.shippingProvider = order.shippingProvider || "Own Delivery";
    }
    await this.orderRepo.save(order);

    try {
      await this.sendOrderStatusEmail(order, "processing");
    } catch (e) {
      console.error("Failed to send processing email:", e);
    }

    if (performedByUserId) {
      try {
        await this.activityLogService.logActivity({
          companyId,
          action: ActivityAction.STATUS_CHANGE,
          entity: ActivityEntity.ORDER,
          entityId: order.id,
          entityName: `Order #${order.id}`,
          description: `Order #${order.id} status changed to processing`,
          oldValues: { status: 'pending' },
          newValues: { status: 'processing' },
          performedByUserId,
        });
      } catch (e) {
        console.error('Failed to log activity:', e);
      }
    }

    return this.findOne(id, companyId);
  }

  async deliverOrder(id: number, companyId: string, systemUserId?: number, permissions?: string[], comment?: string, markAsPaid?: boolean, performedByUserId?: number) {
    const order = await this.findOne(id, companyId);
    if (!order) throw new NotFoundException("Order not found");
    if (order.status === "cancelled") throw new BadRequestException("Order cancelled");
    const previousStatus = order.status;

    await this.addStatusHistory(order.id, order.status, "delivered", comment);
    order.status = "delivered";
    if (comment) order.deliveryNote = comment;
    // When marking as delivered, full payment is considered received (e.g. COD)
    order.isPaid = true;
    order.paidAmount = Number(order.totalAmount);
    await this.orderRepo.save(order);

    try {
      await this.sendOrderStatusEmail(order, "delivered");
    } catch (e) {
      console.error("Failed to send delivered email:", e);
    }

    const LOW_STOCK_THRESHOLD = +(process.env.LOW_STOCK_THRESHOLD ?? 5);

    for (const it of order.items) {
      const product = await this.productRepo.findOne({ 
        where: { id: it.productId, companyId } 
      });
      if (!product) continue;

      // Stock already decreased on order creation, just update sold and income
      // Increase sold count
      product.sold += it.quantity;

      // Accumulate product income
      const itemIncome = Number(it.unitPrice) * Number(it.quantity);
      product.totalIncome = Number(product.totalIncome || 0) + itemIncome;

      // Check low stock and notify
      product.isLowStock = product.stock <= LOW_STOCK_THRESHOLD;
      await this.productRepo.save(product);

      if (product.isLowStock) {
        await this.sendLowStockEmail(product);
      }
    }

    // increment user's successfulOrdersCount if customer exists
    if (order.customer?.id) {
      const user = await this.userRepo.findOne({ 
        where: { id: order.customer.id, companyId } 
      });
      if (user) {
        user.successfulOrdersCount = (user.successfulOrdersCount ?? 0) + 1;
        await this.userRepo.save(user);
      }
    }

    // Assign permissions to system user if provided
    if (systemUserId && permissions && permissions.length > 0) {
      // Note: This requires SystemUser repository injection
      // For now, we'll return a note that permissions should be assigned via the systemuser endpoint
      // In a full implementation, you would inject SystemUser repository here
    }

    const logUserId = performedByUserId ?? systemUserId;
    if (logUserId) {
      try {
        await this.activityLogService.logActivity({
          companyId,
          action: ActivityAction.STATUS_CHANGE,
          entity: ActivityEntity.ORDER,
          entityId: order.id,
          entityName: `Order #${order.id}`,
          description: `Order #${order.id} delivered`,
          oldValues: { status: previousStatus },
          newValues: { status: 'delivered' },
          performedByUserId: logUserId,
        });
      } catch (e) {
        console.error('Failed to log activity:', e);
      }
    }

    return this.findOne(id, companyId);
  }

  async shipOrder(id: number, companyId: string, trackingId?: string, provider?: string, performedByUserId?: number) {
    const order = await this.findOne(id, companyId);
    if (!order) throw new NotFoundException("Order not found");
    if (order.status === "cancelled") throw new BadRequestException("Order cancelled");
    const previousStatus = order.status;

    const wasAlreadyShipped = order.status === "shipped";
    await this.addStatusHistory(order.id, order.status, "shipped");

    order.status = "shipped";

    // Auto-generate trackingId/provider if not provided
    const finalTrackingId = trackingId || order.shippingTrackingId || this.generateTrackingId(order.id);
    const finalProvider = provider || order.shippingProvider || "Custom";

    order.shippingTrackingId = finalTrackingId;
    order.shippingProvider = finalProvider;
    await this.orderRepo.save(order);

    try {
      await this.sendOrderStatusEmail(order, "shipped");
    } catch (e) {
      console.error("Failed to send shipped email:", e);
    }

    if (performedByUserId) {
      try {
      await this.activityLogService.logActivity({
          companyId,
          action: ActivityAction.STATUS_CHANGE,
          entity: ActivityEntity.ORDER,
          entityId: order.id,
          entityName: `Order #${order.id}`,
          description: `Order #${order.id} shipped${finalTrackingId ? ` - Tracking: ${finalTrackingId}` : ''}`,
          oldValues: { status: previousStatus },
          newValues: { status: 'shipped', trackingId: finalTrackingId, provider: finalProvider },
          performedByUserId,
        });
      } catch (e) {
        console.error('Failed to log activity:', e);
      }
    }

    // Only process inventory updates if order was not already shipped (to prevent duplicate processing)
    if (!wasAlreadyShipped) {
      const LOW_STOCK_THRESHOLD = +(process.env.LOW_STOCK_THRESHOLD ?? 5);

      // When order status becomes "Shipped": stock already deducted, increase sold, add income
      for (const it of order.items) {
        const product = await this.productRepo.findOne({ 
          where: { id: it.productId, companyId } 
        });
        if (!product) continue;

        // Stock already deducted on order creation, just update sold and income
        // Increase the sold count
        product.sold += it.quantity;

        // Add the corresponding amount to income
        const itemIncome = Number(it.unitPrice) * Number(it.quantity);
        product.totalIncome = Number(product.totalIncome || 0) + itemIncome;

        // Check low stock and notify
        product.isLowStock = product.stock <= LOW_STOCK_THRESHOLD;
        await this.productRepo.save(product);

        if (product.isLowStock) {
          await this.sendLowStockEmail(product);
        }
      }
    }

    return this.findOne(id, companyId);
  }

  async refundOrder(id: number, companyId: string, performedByUserId?: number) {
    const order = await this.findOne(id, companyId);
    if (!order) throw new NotFoundException("Order not found");
    if (order.status === "refunded") throw new BadRequestException("Already refunded");
    const previousStatus = order.status;

    const wasCancelled = order.status === "cancelled";
    await this.addStatusHistory(order.id, order.status, "refunded");

    order.status = "refunded";
    order.isPaid = false;
    await this.orderRepo.save(order);

    // Only restore stock/sold/income if order was NOT cancelled (cancel already restored stock)
    if (!wasCancelled) {
      for (const it of order.items) {
        const product = await this.productRepo.findOne({
          where: { id: it.productId, companyId },
        });
        if (!product) continue;

        product.stock += it.quantity;
        product.sold = Math.max(0, product.sold - it.quantity);
        const itemIncome = Number(it.unitPrice) * Number(it.quantity);
        product.totalIncome = Math.max(0, Number(product.totalIncome || 0) - itemIncome);

        await this.productRepo.save(product);
      }
    }

    if (performedByUserId) {
      try {
        await this.activityLogService.logActivity({
          companyId,
          action: ActivityAction.STATUS_CHANGE,
          entity: ActivityEntity.ORDER,
          entityId: order.id,
          entityName: `Order #${order.id}`,
          description: `Order #${order.id} refunded`,
          oldValues: { status: previousStatus },
          newValues: { status: 'refunded' },
          performedByUserId,
        });
      } catch (e) {
        console.error('Failed to log activity:', e);
      }
    }

    return this.findOne(id, companyId);
  }

  /**
   * Record a partial payment for an order.
   * When paidAmount >= totalAmount, marks order as fully paid and status "paid".
   */
  async recordPartialPayment(
    id: number,
    companyId: string,
    amount: number,
    paymentRef?: string,
    performedByUserId?: number,
  ) {
    const order = await this.findOne(id, companyId);
    if (!order) throw new NotFoundException("Order not found");
    if (order.status === "cancelled") throw new BadRequestException("Order cancelled");
    if (order.status === "refunded") throw new BadRequestException("Order refunded");
    if (order.isPaid) throw new BadRequestException("Order is already fully paid");

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new BadRequestException("Amount must be a positive number");
    }

    const totalAmount = Number(order.totalAmount);
    const currentPaid = Number(order.paidAmount ?? 0);
    const newPaid = currentPaid + numAmount;

    if (newPaid > totalAmount) {
      throw new BadRequestException(
        `Amount exceeds remaining due. Total: ${totalAmount}, Already paid: ${currentPaid}, Due: ${totalAmount - currentPaid}`,
      );
    }

    const previousStatus = order.status;
    order.paidAmount = newPaid;
    if (paymentRef) order.paymentReference = paymentRef;

    if (newPaid >= totalAmount) {
      order.isPaid = true;
      order.status = "paid";
      await this.addStatusHistory(order.id, previousStatus, "paid", `Partial payment completed. Total paid: ${newPaid}`);
    } else {
      await this.addStatusHistory(
        order.id,
        previousStatus,
        previousStatus,
        `Partial payment: +${numAmount}. Paid: ${newPaid}/${totalAmount}`,
      );
    }

    await this.orderRepo.save(order);

    if (performedByUserId) {
      try {
        await this.activityLogService.logActivity({
          companyId,
          action: ActivityAction.STATUS_CHANGE,
          entity: ActivityEntity.ORDER,
          entityId: order.id,
          entityName: `Order #${order.id}`,
          description: `Partial payment recorded for order #${order.id}: +${numAmount}. Total paid: ${newPaid}/${totalAmount}`,
          oldValues: { paidAmount: currentPaid },
          newValues: { paidAmount: newPaid, isPaid: order.isPaid },
          performedByUserId,
        });
      } catch (e) {
        console.error("Failed to log activity:", e);
      }
    }

    return this.findOne(id, companyId);
  }

  private async sendLowStockEmail(product: ProductEntity) {
    const companyId = product.companyId;
    const stock = product.stock ?? 0;
    const productName = product.name ?? 'Product';
    const sku = product.sku ?? '';

    // Save in-app notification for notifications page
    try {
      if (stock <= 0) {
        await this.notificationsService.saveOutOfStockNotification(companyId, productName, product.id, sku);
      } else if (stock <= 5) {
        await this.notificationsService.saveLowStockNotification(companyId, productName, product.id, stock, sku);
      }
    } catch (e) {
      console.error("Failed to save low stock notification:", e);
    }

    // Send email if ADMIN_EMAIL is configured
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (!adminEmail) {
        console.warn("ADMIN_EMAIL is not set. Low stock alert:", {
          productId: product.id,
          sku: product.sku,
          stock: product.stock,
        });
        return;
      }

      const info = await this.mailer.sendMail({
        companyId: product.companyId,
        from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
        to: adminEmail,
        subject: `Low Stock Alert: ${productName} (${sku})`,
        text: `Product ${productName} (${sku}) is low on stock.\nCurrent stock: ${stock}\nThreshold: ${process.env.LOW_STOCK_THRESHOLD ?? 5}`,
      });

      if (process.env.NODE_ENV !== "production") {
        console.log("Low stock email sent:", info?.id);
      }
    } catch (e) {
      console.error("Failed to send low stock email:", e);
    }
  }

  /** Send individual email to customer when order status changes */
  private async sendOrderStatusEmail(
    order: Order,
    status: "placed" | "processing" | "shipped" | "delivered",
  ) {
    const email = order.customer?.email ?? order.customerEmail;
    if (!email) return;

    const customerName = order.customer?.name ?? order.customerName ?? "Customer";
    const productList = order.items
      ?.map((it) => `${it.product?.name ?? "Product"} x ${it.quantity}`)
      .join("<br>") ?? "";

    try {
      let subject: string;
      let html: string;

      // Resolve store/company name purely from tenant (logged-in panel user company)
      let storeName = "";
      try {
        if (order.companyId) {
          const companyUser = await this.systemuserService.findOneByCompanyId(order.companyId);
          if (companyUser?.companyName) {
            storeName = companyUser.companyName;
          }
        }
      } catch (e) {
        // Fallback to default env/store name if lookup fails
        // eslint-disable-next-line no-console
        console.error("Failed to resolve store name for order email:", e);
      }

      switch (status) {
        case "placed":
          subject = `Order #${order.id} received - thank you for your order`;
          html = generateOrderPlacedEmail(
            customerName,
            order.id,
            Number(order.totalAmount),
            productList,
            storeName,
          );
          break;
        case "processing": {
          subject = `Order #${order.id} is now being processed`;

          // Build public tracking URL for customer email (frontend URL comes from env)
          const frontendBase = 'https://www.fiberace.shop';
          const trackingId = order.shippingTrackingId ?? undefined;
          const trackingUrl =
            frontendBase && trackingId
              ? `${frontendBase.replace(/\/+$/, "")}/order-tracking?trackingId=${encodeURIComponent(
                  trackingId,
                )}`
              : undefined;

          html = generateOrderProcessingEmail(
            customerName,
            order.id,
            storeName,
            trackingUrl,
            trackingId,
          );
          break;
        }
        case "shipped":
          subject = `Order #${order.id} has been shipped`;
          html = generateOrderShippedEmail(
            customerName,
            order.id,
            order.shippingTrackingId ?? undefined,
            order.shippingProvider ?? undefined,
            storeName,
          );
          break;
        case "delivered":
          subject = `Order #${order.id} has been delivered`;
          html = generateOrderDeliveredEmail(customerName, order.id, storeName);
          break;
        default:
          return;
      }

      await this.mailer.sendMail({
        companyId: order.companyId,
        from: process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "noreply@innowavecart.com",
        to: email,
        subject,
        html,
      });
    } catch (e) {
      console.error(`Failed to send order ${status} email to customer:`, e);
    }
  }

  private async sendOwnerNotifications(createDto: CreateOrderDto, order: Order) {
    try {
      // Build notification message
      const customerName = order.customer?.name ?? order.customerName ?? "N/A";
      const customerPhone = order.customer?.phone ?? order.customerPhone ?? "N/A";
      
      // Format product list with quantities
      const productList = order.items
        .map(item => `${item.product?.name || 'Product'} x ${item.quantity} = ${item.totalPrice} BDT`)
        .join('\n');

      const message = `New Order Received!

Order ID: #${order.id}
Customer Name: ${customerName}
Customer Phone: ${customerPhone}

Products:
${productList}

Total Amount: ${order.totalAmount} BDT
Payment Method: ${order.paymentMethod}
Delivery Type: ${order.deliveryType}

Please process this order promptly.`;

      // Always save notification for navbar (shows in notification bell)
      await this.notificationsService.saveOrderCreatedForNavbar(
        order.companyId,
        order.id,
        `New Order #${order.id} - ${customerName}`,
        message,
      );

      // Send email notification to owner if provided
      if (createDto.ownerEmail) {
        await this.notificationsService.sendOwnerEmail(
          createDto.ownerEmail,
          `New Order #${order.id} - ${customerName}`,
          message,
          order.companyId,
          order.id
        );
      }

      // Send WhatsApp/SMS notification to owner if provided
      if (createDto.ownerWhatsapp) {
        await this.notificationsService.sendOwnerWhatsApp(
          createDto.ownerWhatsapp,
          message,
          order.companyId,
          order.id
        );
      }
    } catch (error) {
      // Log error but don't fail the order creation
      console.error("Failed to send owner notifications:", error);
    }
  }

  async softDelete(id: number, companyId: string, performedByUserId?: number): Promise<void> {
    const order = await this.orderRepo.findOne({
      where: { 
        id, 
        companyId, 
        deletedAt: IsNull() // Only delete if not already deleted
      },
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`);

    if (performedByUserId) {
      try {
        await this.activityLogService.logActivity({
          companyId,
          action: ActivityAction.DELETE,
          entity: ActivityEntity.ORDER,
          entityId: order.id,
          entityName: `Order #${order.id}`,
          description: `Order #${order.id} moved to trash`,
          performedByUserId,
        });
      } catch (e) {
        console.error('Failed to log activity:', e);
      }
    }
    
    // Soft delete by setting deletedAt timestamp
    order.deletedAt = new Date();
    await this.orderRepo.save(order);
  }
}
