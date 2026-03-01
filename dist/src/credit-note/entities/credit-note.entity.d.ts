import { User } from '../../users/entities/user.entity';
import { SaleInvoice } from '../../sale-invoice/entities/sale-invoice.entity';
export declare enum CreditNoteStatus {
    PAID = "Paid",
    PENDING = "Pending",
    CANCELLED = "Cancelled"
}
export declare class CreditNote {
    id: number;
    creditNoteNumber: string;
    companyId: string;
    customerId: number;
    customer: User;
    invoiceId: number;
    relatedInvoice: SaleInvoice;
    amount: number;
    paymentMode: string;
    status: CreditNoteStatus;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
