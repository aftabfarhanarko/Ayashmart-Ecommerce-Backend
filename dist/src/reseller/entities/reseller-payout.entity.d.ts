export declare enum ResellerPayoutStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    REJECTED = "REJECTED"
}
export declare class ResellerPayout {
    id: number;
    resellerId: number;
    companyId: string;
    amount: number;
    periodStart?: Date;
    periodEnd?: Date;
    status: ResellerPayoutStatus;
    paymentDetails?: string;
    paidAt?: Date;
    invoiceNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}
