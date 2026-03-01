import { SaleInvoiceStatus } from '../entities/sale-invoice.entity';
export declare class UpdateSaleInvoiceDto {
    status?: SaleInvoiceStatus;
    deliveryStatus?: string;
    fulfillmentStatus?: string;
}
