import { Repository, DataSource } from "typeorm";
import { Order } from "./entities/order.entity";
import { OrderStatusHistory } from "./entities/order-status-history.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { ProductEntity } from "../products/entities/product.entity";
import { User } from "../users/entities/user.entity";
import { PaymentsService } from "../payments/payments.service";
import { VoiceService } from "../voice/voice.service";
import { NotificationsService } from "../notifications/notifications.service";
import { ActivityLogService } from "../systemuser/activity-log.service";
import { SystemuserService } from "../systemuser/systemuser.service";
export declare class OrderService {
    private orderRepo;
    private statusHistoryRepo;
    private productRepo;
    private userRepo;
    private dataSource;
    private readonly paymentsService;
    private readonly notificationsService;
    private readonly activityLogService;
    private readonly systemuserService;
    private readonly mailer;
    private readonly voiceService;
    constructor(orderRepo: Repository<Order>, statusHistoryRepo: Repository<OrderStatusHistory>, productRepo: Repository<ProductEntity>, userRepo: Repository<User>, dataSource: DataSource, paymentsService: PaymentsService, notificationsService: NotificationsService, activityLogService: ActivityLogService, systemuserService: SystemuserService, mailer: {
        sendMail: (message: unknown) => Promise<{
            id?: string;
        }>;
    }, voiceService: VoiceService);
    private addStatusHistory;
    create(createDto: CreateOrderDto, companyId: string, performedByUserId?: number): Promise<{
        order: Order;
        payment: any;
    }>;
    createIncomplete(createDto: CreateOrderDto, companyId: string, orderId?: number): Promise<Order>;
    convertToRealOrder(id: number, companyId: string, performedByUserId?: number): Promise<Order>;
    findAll(companyId: string, resellerId?: number): Promise<Order[]>;
    getStats(companyId: string): Promise<{
        total: number;
        pending: number;
        processing: number;
        paid: number;
        shipped: number;
        delivered: number;
        cancelled: number;
        refunded: number;
        incomplete: number;
        totalRevenue: number;
        unpaidCount: number;
    }>;
    findByCustomerId(customerId: number, companyId: string): Promise<Order[]>;
    findByTrackingId(trackingId: string): Promise<{
        orderId: number;
        status: "pending" | "paid" | "cancelled" | "refunded" | "processing" | "shipped" | "delivered" | "incomplete";
        message: string;
        trackingId: string;
        shippingProvider: string;
        deliveryType: "INSIDEDHAKA" | "OUTSIDEDHAKA";
        createdAt: Date;
        updatedAt: Date;
        statusHistory: OrderStatusHistory[];
        items: {
            name: string;
            quantity: number;
        }[];
    }>;
    findOne(id: number, companyId: string): Promise<Order>;
    recordBarcodeScan(trackingId: string, companyId: string, performedByUserId?: number): Promise<{
        orderId: number;
        trackingId: string;
        message: string;
    }>;
    completeOrder(id: number, companyId: string, paymentRef?: string, performedByUserId?: number): Promise<Order>;
    cancelOrder(id: number, companyId: string, comment?: string, performedByUserId?: number): Promise<{
        message: string;
    }>;
    private generateTrackingId;
    processOrder(id: number, companyId: string, performedByUserId?: number): Promise<Order>;
    deliverOrder(id: number, companyId: string, systemUserId?: number, permissions?: string[], comment?: string, markAsPaid?: boolean, performedByUserId?: number): Promise<Order>;
    shipOrder(id: number, companyId: string, trackingId?: string, provider?: string, performedByUserId?: number): Promise<Order>;
    refundOrder(id: number, companyId: string, performedByUserId?: number): Promise<Order>;
    recordPartialPayment(id: number, companyId: string, amount: number, paymentRef?: string, performedByUserId?: number): Promise<Order>;
    private sendLowStockEmail;
    private sendOrderStatusEmail;
    private sendOwnerNotifications;
    softDelete(id: number, companyId: string, performedByUserId?: number): Promise<void>;
}
