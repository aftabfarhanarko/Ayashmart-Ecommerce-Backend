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
import { User } from '../../users/entities/user.entity';
import { SaleInvoice } from '../../sale-invoice/entities/sale-invoice.entity';

export enum CreditNoteStatus {
  PAID = 'Paid',
  PENDING = 'Pending',
  CANCELLED = 'Cancelled',
}

@Entity('credit_notes')
export class CreditNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  creditNoteNumber: string;

  @Column()
  companyId: string;

  @Column()
  customerId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @Column({ nullable: true })
  invoiceId: number;

  @ManyToOne(() => SaleInvoice, { nullable: true })
  @JoinColumn({ name: 'invoiceId' })
  relatedInvoice: SaleInvoice;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  amount: number;

  @Column({ default: 'Cash' })
  paymentMode: string;

  @Column({
    type: 'enum',
    enum: CreditNoteStatus,
    default: CreditNoteStatus.PENDING,
  })
  status: CreditNoteStatus;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
