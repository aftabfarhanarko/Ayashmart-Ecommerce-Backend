import { SaleInvoice } from './sale-invoice.entity';
import { ProductEntity } from '../../products/entities/product.entity';
export declare enum ItemType {
    PRODUCT = "product",
    SERVICE = "service"
}
export declare class SaleInvoiceItem {
    id: number;
    invoiceId: number;
    invoice: SaleInvoice;
    productId: number;
    product: ProductEntity;
    name: string;
    itemType: ItemType;
    quantity: number;
    unit: string;
    rate: number;
    discount: number;
    tax: number;
    amount: number;
}
