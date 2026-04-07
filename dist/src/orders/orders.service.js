"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const order_entity_1 = require("./entities/order.entity");
const order_status_history_entity_1 = require("./entities/order-status-history.entity");
const product_entity_1 = require("../products/entities/product.entity");
const user_entity_1 = require("../users/entities/user.entity");
const payments_service_1 = require("../payments/payments.service");
const common_2 = require("@nestjs/common");
const voice_service_1 = require("../voice/voice.service");
const notifications_service_1 = require("../notifications/notifications.service");
const order_status_email_templates_1 = require("../common/templates/order-status-email.templates");
const activity_log_service_1 = require("../systemuser/activity-log.service");
const activity_log_entity_1 = require("../systemuser/entities/activity-log.entity");
const systemuser_service_1 = require("../systemuser/systemuser.service");
let OrderService = class OrderService {
    constructor(orderRepo, statusHistoryRepo, productRepo, userRepo, dataSource, paymentsService, notificationsService, activityLogService, systemuserService, mailer, voiceService) {
        this.orderRepo = orderRepo;
        this.statusHistoryRepo = statusHistoryRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.dataSource = dataSource;
        this.paymentsService = paymentsService;
        this.notificationsService = notificationsService;
        this.activityLogService = activityLogService;
        this.systemuserService = systemuserService;
        this.mailer = mailer;
        this.voiceService = voiceService;
    }
    async addStatusHistory(orderId, previousStatus, newStatus, comment) {
        try {
            const history = new order_status_history_entity_1.OrderStatusHistory();
            history.orderId = orderId;
            history.previousStatus = previousStatus ?? undefined;
            history.newStatus = newStatus;
            history.comment = comment;
            await this.statusHistoryRepo.save(history);
        }
        catch (err) {
            console.error("[OrderService] Failed to save status history:", {
                orderId,
                previousStatus,
                newStatus,
                error: err instanceof Error ? err.message : String(err),
            });
        }
    }
    async create(createDto, companyId, performedByUserId) {
        const queryRunner = this.dataSource.createQueryRunner();
        let transactionStarted = false;
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            transactionStarted = true;
            let customer = null;
            if (typeof createDto.customerId === "number") {
                customer = await this.userRepo.findOneBy({ id: createDto.customerId, companyId });
                if (!customer)
                    throw new common_1.NotFoundException("Customer not found");
                if (customer.isBanned) {
                    throw new common_1.BadRequestException("Your account has been banned. You cannot create orders.");
                }
            }
            else if (createDto.customerEmail?.trim()) {
                const email = createDto.customerEmail.trim();
                let userByEmail = await this.userRepo.findOne({
                    where: { email, companyId },
                });
                if (userByEmail) {
                    if (userByEmail.isBanned) {
                        throw new common_1.BadRequestException("Your account has been banned. You cannot create orders.");
                    }
                    customer = userByEmail;
                }
                else {
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
            const order = new order_entity_1.Order();
            order.customer = customer ?? undefined;
            order.customerName = customer?.name ?? createDto.customerName ?? "";
            order.customerPhone = customer?.phone ?? createDto.customerPhone ?? "";
            order.customerEmail = customer?.email ?? createDto.customerEmail ?? undefined;
            order.customerAddress = createDto.shippingAddress ?? customer?.address ?? createDto.customerAddress ?? "";
            order.orderInfo = createDto.orderInfo ?? undefined;
            order.status = "pending";
            order.paymentMethod = createDto.paymentMethod ?? "DIRECT";
            order.deliveryType = createDto.deliveryType ?? "INSIDEDHAKA";
            order.companyId = companyId;
            const items = [];
            let total = 0;
            for (const it of createDto.items) {
                const product = await this.productRepo.findOne({
                    where: {
                        id: it.productId,
                        companyId,
                        deletedAt: (0, typeorm_2.IsNull)()
                    }
                });
                if (!product)
                    throw new common_1.NotFoundException(`Product ${it.productId} not found`);
                if (product.stock < it.quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock for product ${product.id}. Available: ${product.stock}, Requested: ${it.quantity}`);
                }
                product.stock -= it.quantity;
                await queryRunner.manager.save(product);
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
            transactionStarted = false;
            await this.addStatusHistory(savedOrder.id, null, "pending");
            const fullOrder = await this.orderRepo.findOne({
                where: { id: savedOrder.id, companyId },
                relations: ["customer"],
            });
            const customerAddress = fullOrder?.customerAddress ?? "";
            let payment = null;
            try {
                if (fullOrder.paymentMethod === "DIRECT") {
                    payment = await this.paymentsService.initiateSslPayment({
                        amount: fullOrder ? +fullOrder.totalAmount : 0,
                        currency: "BDT",
                        orderId: fullOrder.id.toString(),
                        customerName: fullOrder.customer?.name ?? fullOrder.customerName ?? "",
                        customerEmail: fullOrder.customer?.email ?? "",
                        customerPhone: fullOrder.customer?.phone ?? fullOrder.customerPhone ?? "",
                        customerAddress,
                    });
                }
            }
            catch (paymentErr) {
                console.error('Error initiating payment:', paymentErr);
            }
            try {
                await this.sendOwnerNotifications(createDto, fullOrder);
            }
            catch (notificationErr) {
                console.error('Error sending notifications:', notificationErr);
            }
            try {
                const LOW_STOCK_THRESHOLD = +(process.env.LOW_STOCK_THRESHOLD ?? 5);
                for (const it of fullOrder.items ?? []) {
                    const product = await this.productRepo.findOne({
                        where: { id: it.productId, companyId },
                    });
                    if (!product)
                        continue;
                    product.isLowStock = product.stock <= LOW_STOCK_THRESHOLD;
                    await this.productRepo.save(product);
                    if (product.isLowStock) {
                        await this.sendLowStockEmail(product);
                    }
                }
            }
            catch (stockNotifyErr) {
                console.error('Error checking low stock after order:', stockNotifyErr);
            }
            try {
                await this.sendOrderStatusEmail(fullOrder, "placed");
            }
            catch (emailErr) {
                console.error('Error sending order confirmation email:', emailErr);
            }
            if (performedByUserId && fullOrder) {
                try {
                    await this.activityLogService.logActivity({
                        companyId,
                        action: activity_log_entity_1.ActivityAction.CREATE,
                        entity: activity_log_entity_1.ActivityEntity.ORDER,
                        entityId: fullOrder.id,
                        entityName: `Order #${fullOrder.id}`,
                        description: `Created order #${fullOrder.id} - ${fullOrder.customerName || 'Customer'}`,
                        newValues: { orderId: fullOrder.id, status: fullOrder.status, totalAmount: fullOrder.totalAmount },
                        performedByUserId,
                    });
                }
                catch (e) {
                    console.error('Failed to log activity:', e);
                }
            }
            const phoneToCall = fullOrder?.customerPhone || fullOrder?.customer?.phone;
            if (phoneToCall && fullOrder) {
                this.voiceService.makeOrderConfirmationCall(phoneToCall, fullOrder.id, companyId)
                    .catch(e => console.error('Failed to trigger IVR confirmation call:', e));
            }
            return { order: fullOrder, payment };
        }
        catch (err) {
            if (transactionStarted) {
                try {
                    await queryRunner.rollbackTransaction();
                }
                catch (rollbackErr) {
                    console.error('Error during transaction rollback:', rollbackErr);
                }
            }
            throw err;
        }
        finally {
            try {
                if (!queryRunner.isReleased) {
                    await queryRunner.release();
                }
            }
            catch (releaseErr) {
                console.error('Error releasing query runner:', releaseErr);
            }
        }
    }
    async createIncomplete(createDto, companyId, orderId) {
        let order = null;
        if (orderId) {
            order = await this.orderRepo.findOne({ where: { id: orderId, companyId, status: "incomplete" } });
        }
        if (!order) {
            order = new order_entity_1.Order();
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
        const items = [];
        let total = 0;
        for (const it of (createDto.items || [])) {
            const product = await this.productRepo.findOne({
                where: { id: it.productId, companyId, deletedAt: (0, typeorm_2.IsNull)() }
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
    async convertToRealOrder(id, companyId, performedByUserId) {
        const order = await this.orderRepo.findOne({
            where: { id, companyId, status: "incomplete" },
            relations: ["customer"]
        });
        if (!order)
            throw new common_1.NotFoundException("Incomplete order not found");
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const it of order.items) {
                const product = await queryRunner.manager.findOne(product_entity_1.ProductEntity, {
                    where: { id: it.productId, companyId, deletedAt: (0, typeorm_2.IsNull)() }
                });
                if (!product)
                    throw new common_1.NotFoundException(`Product ${it.productId} not found`);
                if (product.stock < it.quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock for product ${product.name}`);
                }
                product.stock -= it.quantity;
                await queryRunner.manager.save(product);
            }
            order.status = "pending";
            const savedOrder = await queryRunner.manager.save(order);
            await queryRunner.commitTransaction();
            await this.addStatusHistory(savedOrder.id, "incomplete", "pending", "Converted from incomplete order");
            const fullOrder = await this.orderRepo.findOne({
                where: { id: savedOrder.id, companyId },
                relations: ["customer"]
            });
            if (fullOrder) {
                try {
                    const createDto = {
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
                }
                catch (e) {
                    console.error("Failed to send conversion notifications:", e);
                }
                if (performedByUserId) {
                    await this.activityLogService.logActivity({
                        companyId,
                        action: activity_log_entity_1.ActivityAction.STATUS_CHANGE,
                        entity: activity_log_entity_1.ActivityEntity.ORDER,
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
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(companyId, resellerId) {
        const orders = await this.orderRepo.find({
            where: {
                companyId,
                deletedAt: (0, typeorm_2.IsNull)(),
            },
            relations: ["customer"],
            order: { createdAt: 'DESC' },
        });
        if (!resellerId) {
            return orders;
        }
        return orders
            .map((o) => {
            const ownItems = (o.items || []).filter((it) => it.resellerId === resellerId);
            if (ownItems.length === 0)
                return null;
            const clone = { ...o };
            clone.items = ownItems;
            return clone;
        })
            .filter(Boolean);
    }
    async getStats(companyId) {
        const orders = await this.orderRepo.find({
            where: { companyId, deletedAt: (0, typeorm_2.IsNull)() },
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
        const paidOrders = orders.filter((o) => o.isPaid || o.status === "paid" || o.status === "delivered");
        const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
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
    async findByCustomerId(customerId, companyId) {
        return this.orderRepo.find({
            where: {
                customer: { id: customerId },
                companyId,
                deletedAt: (0, typeorm_2.IsNull)()
            },
            relations: ["customer"],
            order: { createdAt: 'DESC' }
        });
    }
    async findByTrackingId(trackingId) {
        const trimmed = (trackingId || "").trim();
        if (!trimmed)
            throw new common_1.BadRequestException("Tracking number is required");
        const order = await this.orderRepo.findOne({
            where: {
                shippingTrackingId: trimmed,
                deletedAt: (0, typeorm_2.IsNull)(),
            },
            relations: ["customer"],
        });
        if (!order)
            throw new common_1.NotFoundException("Order not found for this tracking number");
        let statusHistory = await this.statusHistoryRepo.find({
            where: { orderId: order.id },
            order: { createdAt: "ASC" },
        });
        if (statusHistory.length === 0 && order.createdAt) {
            statusHistory = [
                {
                    id: 0,
                    orderId: order.id,
                    previousStatus: undefined,
                    newStatus: order.status,
                    comment: undefined,
                    createdAt: order.createdAt,
                },
            ];
        }
        const statusMessages = {
            pending: "Your order has been received and is awaiting confirmation.",
            processing: "Your order is being prepared for shipment.",
            paid: "Payment received. Your order is being processed.",
            shipped: "Your order has been shipped and is on its way.",
            delivered: "Your order has been delivered successfully.",
            cancelled: "This order has been cancelled.",
            refunded: "This order has been refunded.",
        };
        const message = statusMessages[order.status] ?? "Your order status is being updated.";
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
    async findOne(id, companyId) {
        const o = await this.orderRepo.findOne({
            where: {
                id,
                companyId,
                deletedAt: (0, typeorm_2.IsNull)()
            },
            relations: ["customer"]
        });
        if (!o)
            throw new common_1.NotFoundException("Order not found");
        return o;
    }
    async recordBarcodeScan(trackingId, companyId, performedByUserId) {
        const trimmed = (trackingId || "").trim();
        if (!trimmed)
            throw new common_1.BadRequestException("Tracking number is required");
        const order = await this.orderRepo.findOne({
            where: {
                shippingTrackingId: trimmed,
                companyId,
                deletedAt: (0, typeorm_2.IsNull)(),
            },
            relations: ["customer"],
        });
        if (!order)
            throw new common_1.NotFoundException("Order not found for this tracking number");
        if (performedByUserId) {
            try {
                await this.activityLogService.logActivity({
                    companyId,
                    action: activity_log_entity_1.ActivityAction.BARCODE_SCAN,
                    entity: activity_log_entity_1.ActivityEntity.ORDER,
                    entityId: order.id,
                    entityName: `Order #${order.id}`,
                    description: `Barcode scanned for order #${order.id} - Tracking: ${trimmed}`,
                    oldValues: {},
                    newValues: { trackingId: trimmed, orderId: order.id },
                    performedByUserId,
                });
            }
            catch (e) {
                console.error("Failed to log barcode scan:", e);
            }
        }
        return { orderId: order.id, trackingId: trimmed, message: "Barcode scan recorded" };
    }
    async completeOrder(id, companyId, paymentRef, performedByUserId) {
        const order = await this.findOne(id, companyId);
        if (!order)
            throw new common_1.NotFoundException("Order not found");
        if (order.status === "cancelled")
            throw new common_1.BadRequestException("Order cancelled");
        const previousStatus = order.status;
        await this.addStatusHistory(order.id, order.status, "paid");
        order.isPaid = true;
        order.paidAmount = Number(order.totalAmount);
        order.paymentReference = paymentRef ?? undefined;
        order.status = "paid";
        await this.orderRepo.save(order);
        for (const it of order.items) {
            const product = await this.productRepo.findOne({
                where: { id: it.productId, companyId }
            });
            if (product) {
                product.sold += it.quantity;
                await this.productRepo.save(product);
            }
        }
        if (performedByUserId) {
            try {
                await this.activityLogService.logActivity({
                    companyId,
                    action: activity_log_entity_1.ActivityAction.STATUS_CHANGE,
                    entity: activity_log_entity_1.ActivityEntity.ORDER,
                    entityId: order.id,
                    entityName: `Order #${order.id}`,
                    description: `Order #${order.id} marked as paid/completed`,
                    oldValues: { status: previousStatus },
                    newValues: { status: 'paid' },
                    performedByUserId,
                });
            }
            catch (e) {
                console.error('Failed to log activity:', e);
            }
        }
        return this.findOne(id, companyId);
    }
    async cancelOrder(id, companyId, comment, performedByUserId) {
        const order = await this.findOne(id, companyId);
        const previousStatus = order.status;
        if (!performedByUserId) {
            const created = new Date(order.createdAt);
            const now = new Date();
            const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
            if (hoursDiff > 24) {
                throw new common_1.BadRequestException("Order can only be cancelled within 24 hours of placement");
            }
        }
        if (order.status === "cancelled")
            throw new common_1.BadRequestException("Already cancelled");
        if (order.status === "refunded")
            throw new common_1.BadRequestException("Already refunded");
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
        if (order.customer?.id) {
            const user = await this.userRepo.findOne({
                where: { id: order.customer.id, companyId }
            });
            if (user) {
                user.cancelledOrdersCount = (user.cancelledOrdersCount ?? 0) + 1;
                await this.userRepo.save(user);
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
                    action: activity_log_entity_1.ActivityAction.STATUS_CHANGE,
                    entity: activity_log_entity_1.ActivityEntity.ORDER,
                    entityId: order.id,
                    entityName: `Order #${order.id}`,
                    description: `Order #${order.id} cancelled`,
                    oldValues: { status: previousStatus },
                    newValues: { status: 'cancelled' },
                    performedByUserId,
                });
            }
            catch (e) {
                console.error('Failed to log activity:', e);
            }
        }
        return { message: "Order cancelled" };
    }
    generateTrackingId(orderId) {
        const suffix = (0, crypto_1.randomBytes)(4).toString("hex").toUpperCase();
        return `SC-${orderId}-${suffix}`;
    }
    async processOrder(id, companyId, performedByUserId) {
        const order = await this.findOne(id, companyId);
        if (!order)
            throw new common_1.NotFoundException("Order not found");
        if (order.status === "cancelled")
            throw new common_1.BadRequestException("Order cancelled");
        if (order.status === "processing")
            throw new common_1.BadRequestException("Order is already being processed");
        await this.addStatusHistory(order.id, order.status, "processing");
        order.status = "processing";
        if (!order.shippingTrackingId) {
            order.shippingTrackingId = this.generateTrackingId(order.id);
            order.shippingProvider = order.shippingProvider || "Own Delivery";
        }
        await this.orderRepo.save(order);
        try {
            await this.sendOrderStatusEmail(order, "processing");
        }
        catch (e) {
            console.error("Failed to send processing email:", e);
        }
        if (performedByUserId) {
            try {
                await this.activityLogService.logActivity({
                    companyId,
                    action: activity_log_entity_1.ActivityAction.STATUS_CHANGE,
                    entity: activity_log_entity_1.ActivityEntity.ORDER,
                    entityId: order.id,
                    entityName: `Order #${order.id}`,
                    description: `Order #${order.id} status changed to processing`,
                    oldValues: { status: 'pending' },
                    newValues: { status: 'processing' },
                    performedByUserId,
                });
            }
            catch (e) {
                console.error('Failed to log activity:', e);
            }
        }
        return this.findOne(id, companyId);
    }
    async deliverOrder(id, companyId, systemUserId, permissions, comment, markAsPaid, performedByUserId) {
        const order = await this.findOne(id, companyId);
        if (!order)
            throw new common_1.NotFoundException("Order not found");
        if (order.status === "cancelled")
            throw new common_1.BadRequestException("Order cancelled");
        const previousStatus = order.status;
        await this.addStatusHistory(order.id, order.status, "delivered", comment);
        order.status = "delivered";
        if (comment)
            order.deliveryNote = comment;
        order.isPaid = true;
        order.paidAmount = Number(order.totalAmount);
        await this.orderRepo.save(order);
        try {
            await this.sendOrderStatusEmail(order, "delivered");
        }
        catch (e) {
            console.error("Failed to send delivered email:", e);
        }
        const LOW_STOCK_THRESHOLD = +(process.env.LOW_STOCK_THRESHOLD ?? 5);
        for (const it of order.items) {
            const product = await this.productRepo.findOne({
                where: { id: it.productId, companyId }
            });
            if (!product)
                continue;
            product.sold += it.quantity;
            const itemIncome = Number(it.unitPrice) * Number(it.quantity);
            product.totalIncome = Number(product.totalIncome || 0) + itemIncome;
            product.isLowStock = product.stock <= LOW_STOCK_THRESHOLD;
            await this.productRepo.save(product);
            if (product.isLowStock) {
                await this.sendLowStockEmail(product);
            }
        }
        if (order.customer?.id) {
            const user = await this.userRepo.findOne({
                where: { id: order.customer.id, companyId }
            });
            if (user) {
                user.successfulOrdersCount = (user.successfulOrdersCount ?? 0) + 1;
                await this.userRepo.save(user);
            }
        }
        if (systemUserId && permissions && permissions.length > 0) {
        }
        const logUserId = performedByUserId ?? systemUserId;
        if (logUserId) {
            try {
                await this.activityLogService.logActivity({
                    companyId,
                    action: activity_log_entity_1.ActivityAction.STATUS_CHANGE,
                    entity: activity_log_entity_1.ActivityEntity.ORDER,
                    entityId: order.id,
                    entityName: `Order #${order.id}`,
                    description: `Order #${order.id} delivered`,
                    oldValues: { status: previousStatus },
                    newValues: { status: 'delivered' },
                    performedByUserId: logUserId,
                });
            }
            catch (e) {
                console.error('Failed to log activity:', e);
            }
        }
        return this.findOne(id, companyId);
    }
    async shipOrder(id, companyId, trackingId, provider, performedByUserId) {
        const order = await this.findOne(id, companyId);
        if (!order)
            throw new common_1.NotFoundException("Order not found");
        if (order.status === "cancelled")
            throw new common_1.BadRequestException("Order cancelled");
        const previousStatus = order.status;
        const wasAlreadyShipped = order.status === "shipped";
        await this.addStatusHistory(order.id, order.status, "shipped");
        order.status = "shipped";
        const finalTrackingId = trackingId || order.shippingTrackingId || this.generateTrackingId(order.id);
        const finalProvider = provider || order.shippingProvider || "Custom";
        order.shippingTrackingId = finalTrackingId;
        order.shippingProvider = finalProvider;
        await this.orderRepo.save(order);
        try {
            await this.sendOrderStatusEmail(order, "shipped");
        }
        catch (e) {
            console.error("Failed to send shipped email:", e);
        }
        if (performedByUserId) {
            try {
                await this.activityLogService.logActivity({
                    companyId,
                    action: activity_log_entity_1.ActivityAction.STATUS_CHANGE,
                    entity: activity_log_entity_1.ActivityEntity.ORDER,
                    entityId: order.id,
                    entityName: `Order #${order.id}`,
                    description: `Order #${order.id} shipped${finalTrackingId ? ` - Tracking: ${finalTrackingId}` : ''}`,
                    oldValues: { status: previousStatus },
                    newValues: { status: 'shipped', trackingId: finalTrackingId, provider: finalProvider },
                    performedByUserId,
                });
            }
            catch (e) {
                console.error('Failed to log activity:', e);
            }
        }
        if (!wasAlreadyShipped) {
            const LOW_STOCK_THRESHOLD = +(process.env.LOW_STOCK_THRESHOLD ?? 5);
            for (const it of order.items) {
                const product = await this.productRepo.findOne({
                    where: { id: it.productId, companyId }
                });
                if (!product)
                    continue;
                product.sold += it.quantity;
                const itemIncome = Number(it.unitPrice) * Number(it.quantity);
                product.totalIncome = Number(product.totalIncome || 0) + itemIncome;
                product.isLowStock = product.stock <= LOW_STOCK_THRESHOLD;
                await this.productRepo.save(product);
                if (product.isLowStock) {
                    await this.sendLowStockEmail(product);
                }
            }
        }
        return this.findOne(id, companyId);
    }
    async refundOrder(id, companyId, performedByUserId) {
        const order = await this.findOne(id, companyId);
        if (!order)
            throw new common_1.NotFoundException("Order not found");
        if (order.status === "refunded")
            throw new common_1.BadRequestException("Already refunded");
        const previousStatus = order.status;
        const wasCancelled = order.status === "cancelled";
        await this.addStatusHistory(order.id, order.status, "refunded");
        order.status = "refunded";
        order.isPaid = false;
        await this.orderRepo.save(order);
        if (!wasCancelled) {
            for (const it of order.items) {
                const product = await this.productRepo.findOne({
                    where: { id: it.productId, companyId },
                });
                if (!product)
                    continue;
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
                    action: activity_log_entity_1.ActivityAction.STATUS_CHANGE,
                    entity: activity_log_entity_1.ActivityEntity.ORDER,
                    entityId: order.id,
                    entityName: `Order #${order.id}`,
                    description: `Order #${order.id} refunded`,
                    oldValues: { status: previousStatus },
                    newValues: { status: 'refunded' },
                    performedByUserId,
                });
            }
            catch (e) {
                console.error('Failed to log activity:', e);
            }
        }
        return this.findOne(id, companyId);
    }
    async recordPartialPayment(id, companyId, amount, paymentRef, performedByUserId) {
        const order = await this.findOne(id, companyId);
        if (!order)
            throw new common_1.NotFoundException("Order not found");
        if (order.status === "cancelled")
            throw new common_1.BadRequestException("Order cancelled");
        if (order.status === "refunded")
            throw new common_1.BadRequestException("Order refunded");
        if (order.isPaid)
            throw new common_1.BadRequestException("Order is already fully paid");
        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            throw new common_1.BadRequestException("Amount must be a positive number");
        }
        const totalAmount = Number(order.totalAmount);
        const currentPaid = Number(order.paidAmount ?? 0);
        const newPaid = currentPaid + numAmount;
        if (newPaid > totalAmount) {
            throw new common_1.BadRequestException(`Amount exceeds remaining due. Total: ${totalAmount}, Already paid: ${currentPaid}, Due: ${totalAmount - currentPaid}`);
        }
        const previousStatus = order.status;
        order.paidAmount = newPaid;
        if (paymentRef)
            order.paymentReference = paymentRef;
        if (newPaid >= totalAmount) {
            order.isPaid = true;
            order.status = "paid";
            await this.addStatusHistory(order.id, previousStatus, "paid", `Partial payment completed. Total paid: ${newPaid}`);
        }
        else {
            await this.addStatusHistory(order.id, previousStatus, previousStatus, `Partial payment: +${numAmount}. Paid: ${newPaid}/${totalAmount}`);
        }
        await this.orderRepo.save(order);
        if (performedByUserId) {
            try {
                await this.activityLogService.logActivity({
                    companyId,
                    action: activity_log_entity_1.ActivityAction.STATUS_CHANGE,
                    entity: activity_log_entity_1.ActivityEntity.ORDER,
                    entityId: order.id,
                    entityName: `Order #${order.id}`,
                    description: `Partial payment recorded for order #${order.id}: +${numAmount}. Total paid: ${newPaid}/${totalAmount}`,
                    oldValues: { paidAmount: currentPaid },
                    newValues: { paidAmount: newPaid, isPaid: order.isPaid },
                    performedByUserId,
                });
            }
            catch (e) {
                console.error("Failed to log activity:", e);
            }
        }
        return this.findOne(id, companyId);
    }
    async sendLowStockEmail(product) {
        const companyId = product.companyId;
        const stock = product.stock ?? 0;
        const productName = product.name ?? 'Product';
        const sku = product.sku ?? '';
        try {
            if (stock <= 0) {
                await this.notificationsService.saveOutOfStockNotification(companyId, productName, product.id, sku);
            }
            else if (stock <= 5) {
                await this.notificationsService.saveLowStockNotification(companyId, productName, product.id, stock, sku);
            }
        }
        catch (e) {
            console.error("Failed to save low stock notification:", e);
        }
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
        }
        catch (e) {
            console.error("Failed to send low stock email:", e);
        }
    }
    async sendOrderStatusEmail(order, status) {
        const email = order.customer?.email ?? order.customerEmail;
        if (!email)
            return;
        const customerName = order.customer?.name ?? order.customerName ?? "Customer";
        const productList = order.items
            ?.map((it) => `${it.product?.name ?? "Product"} x ${it.quantity}`)
            .join("<br>") ?? "";
        try {
            let subject;
            let html;
            let storeName = "";
            try {
                if (order.companyId) {
                    const companyUser = await this.systemuserService.findOneByCompanyId(order.companyId);
                    if (companyUser?.companyName) {
                        storeName = companyUser.companyName;
                    }
                }
            }
            catch (e) {
                console.error("Failed to resolve store name for order email:", e);
            }
            switch (status) {
                case "placed":
                    subject = `Order #${order.id} received - thank you for your order`;
                    html = (0, order_status_email_templates_1.generateOrderPlacedEmail)(customerName, order.id, Number(order.totalAmount), productList, storeName);
                    break;
                case "processing": {
                    subject = `Order #${order.id} is now being processed`;
                    const frontendBase = 'https://www.fiberace.shop';
                    const trackingId = order.shippingTrackingId ?? undefined;
                    const trackingUrl = frontendBase && trackingId
                        ? `${frontendBase.replace(/\/+$/, "")}/order-tracking?trackingId=${encodeURIComponent(trackingId)}`
                        : undefined;
                    html = (0, order_status_email_templates_1.generateOrderProcessingEmail)(customerName, order.id, storeName, trackingUrl, trackingId);
                    break;
                }
                case "shipped":
                    subject = `Order #${order.id} has been shipped`;
                    html = (0, order_status_email_templates_1.generateOrderShippedEmail)(customerName, order.id, order.shippingTrackingId ?? undefined, order.shippingProvider ?? undefined, storeName);
                    break;
                case "delivered":
                    subject = `Order #${order.id} has been delivered`;
                    html = (0, order_status_email_templates_1.generateOrderDeliveredEmail)(customerName, order.id, storeName);
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
        }
        catch (e) {
            console.error(`Failed to send order ${status} email to customer:`, e);
        }
    }
    async sendOwnerNotifications(createDto, order) {
        try {
            const customerName = order.customer?.name ?? order.customerName ?? "N/A";
            const customerPhone = order.customer?.phone ?? order.customerPhone ?? "N/A";
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
            await this.notificationsService.saveOrderCreatedForNavbar(order.companyId, order.id, `New Order #${order.id} - ${customerName}`, message);
            if (createDto.ownerEmail) {
                await this.notificationsService.sendOwnerEmail(createDto.ownerEmail, `New Order #${order.id} - ${customerName}`, message, order.companyId, order.id);
            }
            if (createDto.ownerWhatsapp) {
                await this.notificationsService.sendOwnerWhatsApp(createDto.ownerWhatsapp, message, order.companyId, order.id);
            }
        }
        catch (error) {
            console.error("Failed to send owner notifications:", error);
        }
    }
    async softDelete(id, companyId, performedByUserId) {
        const order = await this.orderRepo.findOne({
            where: {
                id,
                companyId,
                deletedAt: (0, typeorm_2.IsNull)()
            },
        });
        if (!order)
            throw new common_1.NotFoundException(`Order ${id} not found`);
        if (performedByUserId) {
            try {
                await this.activityLogService.logActivity({
                    companyId,
                    action: activity_log_entity_1.ActivityAction.DELETE,
                    entity: activity_log_entity_1.ActivityEntity.ORDER,
                    entityId: order.id,
                    entityName: `Order #${order.id}`,
                    description: `Order #${order.id} moved to trash`,
                    performedByUserId,
                });
            }
            catch (e) {
                console.error('Failed to log activity:', e);
            }
        }
        order.deletedAt = new Date();
        await this.orderRepo.save(order);
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_status_history_entity_1.OrderStatusHistory)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(9, (0, common_2.Inject)('MAILER_TRANSPORT')),
    __param(10, (0, common_2.Inject)((0, common_2.forwardRef)(() => voice_service_1.VoiceService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        payments_service_1.PaymentsService,
        notifications_service_1.NotificationsService,
        activity_log_service_1.ActivityLogService,
        systemuser_service_1.SystemuserService, Object, voice_service_1.VoiceService])
], OrderService);
//# sourceMappingURL=orders.service.js.map