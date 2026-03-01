import { User } from '../../users/entities/user.entity';
import { SaleInvoiceItem } from './sale-invoice-item.entity';
export declare enum SaleInvoiceStatus {
    DRAFT = "draft",
    PENDING = "pending",
    SENT = "sent",
    PAID = "paid",
    PARTIAL = "partial",
    OVERDUE = "overdue",
    CANCELLED = "cancelled"
}
export declare class SaleInvoice {
    id: number;
    invoiceNumber: string;
    referenceNumber: string;
    invoiceDate: Date;
    dueDate: Date;
    status: SaleInvoiceStatus;
    deliveryStatus: string;
    fulfillmentStatus: string;
    companyId: string;
    customerId: number;
    customer: User;
    currency: string;
    isRecurring: boolean;
    recurringInterval: string;
    notes: string;
    termsAndConditions: string;
    bankDetails: any;
    subTotal: number;
    taxTotal: number;
    discountTotal: number;
    totalAmount: number;
    signatureName: string;
    signatureImage: string;
    items: SaleInvoiceItem[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
