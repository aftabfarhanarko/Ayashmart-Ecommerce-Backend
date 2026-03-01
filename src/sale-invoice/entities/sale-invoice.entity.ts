import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SaleInvoiceItem } from './sale-invoice-item.entity';

export enum SaleInvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  SENT = 'sent',
  PAID = 'paid',
  PARTIAL = 'partial',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

@Entity('sale_invoices')
export class SaleInvoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column({ nullable: true })
  referenceNumber: string;

  @Column({ type: 'date' })
  invoiceDate: Date;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: SaleInvoiceStatus,
    default: SaleInvoiceStatus.DRAFT,
  })
  status: SaleInvoiceStatus;

  @Column({ nullable: true })
  deliveryStatus: string;

  @Column({ type: 'varchar', nullable: true })
  fulfillmentStatus: string;

  @Column()
  companyId: string;

  @Column()
  customerId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @Column({ default: 'BDT' })
  currency: string;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ nullable: true })
  recurringInterval: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  termsAndConditions: string;

  @Column('json', { nullable: true })
  bankDetails: any;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  subTotal: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  taxTotal: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  discountTotal: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ nullable: true })
  signatureName: string;

  @Column({ nullable: true })
  signatureImage: string;

  @OneToMany(() => SaleInvoiceItem, (item) => item.invoice, { cascade: true })
  items: SaleInvoiceItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
