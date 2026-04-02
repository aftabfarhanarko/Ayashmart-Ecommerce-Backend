import { User } from "../../users/entities/user.entity";
export declare class Order {
    id: number;
    customer?: User;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    customerAddress?: string;
    items: Array<{
        productId: number;
        resellerId?: number;
        product?: {
            id: number;
            name: string;
            sku?: string;
            images?: Array<{
                url: string;
                isPrimary?: boolean;
            }>;
        };
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }>;
    totalAmount: number;
    paidAmount: number;
    status: "pending" | "processing" | "paid" | "shipped" | "delivered" | "cancelled" | "refunded" | "incomplete";
    paymentReference?: string;
    orderInfo?: string;
    paymentMethod: "DIRECT" | "COD";
    shippingTrackingId?: string;
    shippingProvider?: string;
    isPaid: boolean;
    companyId: string;
    deliveryType: "INSIDEDHAKA" | "OUTSIDEDHAKA";
    deliveryNote?: string;
    cancelNote?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
