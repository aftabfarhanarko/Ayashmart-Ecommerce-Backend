import { Order } from "./order.entity";
export declare class OrderStatusHistory {
    id: number;
    orderId: number;
    order?: Order;
    previousStatus?: string;
    newStatus: string;
    comment?: string;
    createdAt: Date;
}
