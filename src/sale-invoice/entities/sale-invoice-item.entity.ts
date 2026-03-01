import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SaleInvoice } from './sale-invoice.entity';
import { ProductEntity } from '../../products/entities/product.entity';

export enum ItemType {
  PRODUCT = 'product',
  SERVICE = 'service',
}

@Entity('sale_invoice_items')
export class SaleInvoiceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  invoiceId: number;

  @ManyToOne(() => SaleInvoice, (invoice) => invoice.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoiceId' })
  invoice: SaleInvoice;

  @Column({ nullable: true })
  productId: number;

  @ManyToOne(() => ProductEntity, { nullable: true })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ItemType,
    default: ItemType.PRODUCT,
  })
  itemType: ItemType;

  @Column('decimal', { precision: 12, scale: 2 })
  quantity: number;

  @Column({ nullable: true })
  unit: string;

  @Column('decimal', { precision: 12, scale: 2 })
  rate: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  discount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  tax: number;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;
}
