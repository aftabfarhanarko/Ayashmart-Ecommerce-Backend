import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ResellerPayoutStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REJECTED = 'REJECTED',
}

@Entity('reseller_payouts')
export class ResellerPayout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  resellerId: number;

  @Column()
  companyId: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp', nullable: true })
  periodStart?: Date;

  @Column({ type: 'timestamp', nullable: true })
  periodEnd?: Date;

  @Column({
    type: 'enum',
    enum: ResellerPayoutStatus,
    default: ResellerPayoutStatus.PENDING,
  })
  status: ResellerPayoutStatus;

  @Column({ type: 'text', nullable: true })
  paymentDetails?: string;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  /** Set when payout is approved/paid; used for invoice download */
  @Column({ nullable: true })
  invoiceNumber?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

