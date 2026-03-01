import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SystemUser } from '../../systemuser/entities/systemuser.entity';

export enum InvoiceStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

export enum AmountType {
  PACKAGE = 'package',
  SUBSCRIPTION = 'subscription',
  ADDON = 'addon',
  CUSTOM = 'custom',
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column({ unique: true })
  transactionId: string;

  @Column()
  customerId: number;

  @ManyToOne(() => SystemUser, { nullable: false })
  @JoinColumn({ name: 'customerId' })
  customer: SystemUser;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  dueAmount: number;

  @Column({
    type: 'enum',
    enum: AmountType,
    default: AmountType.PACKAGE,
  })
  amountType: AmountType;

  /** Package to assign to customer when invoice is paid (for amountType PACKAGE). */
  @Column('int', { nullable: true })
  packageId: number | null;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING,
  })
  status: InvoiceStatus;

  @Column({ nullable: true })
  bkashPaymentID: string;

  @Column({ nullable: true })
  bkashTrxID: string;

  @Column('json', { nullable: true })
  bankPayment: {
    bankName?: string;
    amount?: number;
    accLastDigit?: string;
    status?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
