declare class OrderItemDto {
    productId: number;
    quantity: number;
}
export declare class CreateOrderDto {
    customerId?: number;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    customerAddress?: string;
    items: OrderItemDto[];
    shippingAddress?: string;
    paymentMethod?: "DIRECT" | "COD";
    pickupPoint?: any;
    deliveryType?: "INSIDEDHAKA" | "OUTSIDEDHAKA";
    ownerEmail?: string;
    ownerWhatsapp?: string;
}
export {};
