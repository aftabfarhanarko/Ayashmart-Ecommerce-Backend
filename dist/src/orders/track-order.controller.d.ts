import { OrderService } from "./orders.service";
export declare class TrackOrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    track(trackingId: string): Promise<{
        statusCode: number;
        message: string;
        data: {
            orderId: number;
            status: "pending" | "paid" | "cancelled" | "refunded" | "processing" | "shipped" | "delivered" | "incomplete";
            message: string;
            trackingId: string;
            shippingProvider: string;
            deliveryType: "INSIDEDHAKA" | "OUTSIDEDHAKA";
            createdAt: Date;
            updatedAt: Date;
            statusHistory: import("./entities/order-status-history.entity").OrderStatusHistory[];
            items: {
                name: string;
                quantity: number;
            }[];
        };
    }>;
}
