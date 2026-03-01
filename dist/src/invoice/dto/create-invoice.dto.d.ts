import { AmountType, InvoiceStatus } from '../entities/invoice.entity';
export declare class CreateInvoiceDto {
    customerId: number;
    totalAmount: number;
    paidAmount?: number;
    amountType?: AmountType;
    packageId?: number;
    status?: InvoiceStatus;
}
