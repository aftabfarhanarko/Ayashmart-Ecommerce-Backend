import { SaleInvoiceStatus } from '../entities/sale-invoice.entity';
import { ItemType } from '../entities/sale-invoice-item.entity';
declare class CreateSaleInvoiceItemDto {
    name: string;
    productId?: number;
    itemType?: ItemType;
    quantity: number;
    unit?: string;
    rate: number;
    discount?: number;
    tax?: number;
    amount: number;
}
export declare class CreateSaleInvoiceDto {
    invoiceNumber: string;
    referenceNumber?: string;
    invoiceDate: string;
    dueDate?: string;
    status?: SaleInvoiceStatus;
    customerId: number;
    currency?: string;
    isRecurring?: boolean;
    recurringInterval?: string;
    notes?: string;
    termsAndConditions?: string;
    bankDetails?: any;
    subTotal: number;
    taxTotal: number;
    discountTotal: number;
    totalAmount: number;
    signatureName?: string;
    signatureImage?: string;
    deliveryStatus?: string;
    fulfillmentStatus?: string;
    items: CreateSaleInvoiceItemDto[];
}
export {};
