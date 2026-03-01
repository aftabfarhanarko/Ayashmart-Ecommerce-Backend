import { SystemUser } from '../../systemuser/entities/systemuser.entity';
export declare enum InvoiceStatus {
    PENDING = "pending",
    PAID = "paid",
    CANCELLED = "cancelled",
    REFUNDED = "refunded",
    FAILED = "failed"
}
export declare enum AmountType {
    PACKAGE = "package",
    SUBSCRIPTION = "subscription",
    ADDON = "addon",
    CUSTOM = "custom"
}
export declare class Invoice {
    id: number;
    invoiceNumber: string;
    transactionId: string;
    customerId: number;
    customer: SystemUser;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    amountType: AmountType;
    packageId: number | null;
    status: InvoiceStatus;
    bkashPaymentID: string;
    bkashTrxID: string;
    bankPayment: {
        bankName?: string;
        amount?: number;
        accLastDigit?: string;
        status?: string;
    };
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
