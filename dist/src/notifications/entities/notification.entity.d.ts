export declare enum NotificationType {
    ORDER_CREATED = "order_created",
    ORDER_CONFIRMED = "order_confirmed",
    ORDER_PROCESSING = "order_processing",
    ORDER_SHIPPED = "order_shipped",
    ORDER_DELIVERED = "order_delivered",
    ORDER_CANCELLED = "order_cancelled",
    ORDER_REFUNDED = "order_refunded",
    PAYMENT_RECEIVED = "payment_received",
    PAYMENT_FAILED = "payment_failed",
    NEW_CUSTOMER = "new_customer",
    CUSTOMER_UPDATED = "customer_updated",
    LOW_STOCK = "low_stock",
    OUT_OF_STOCK = "out_of_stock",
    PRODUCT_ADDED = "product_added",
    PRODUCT_UPDATED = "product_updated",
    BROADCAST_EMAIL = "broadcast_email",
    BROADCAST_SMS = "broadcast_sms"
}
export declare enum NotificationChannel {
    EMAIL = "email",
    SMS = "sms",
    WHATSAPP = "whatsapp"
}
export declare class Notification {
    id: number;
    companyId: string;
    type: NotificationType;
    channel: NotificationChannel;
    recipient: string;
    subject?: string;
    message: string;
    status: string;
    isRead: boolean;
    orderId?: number;
    metadata?: Record<string, any>;
    createdAt: Date;
}
