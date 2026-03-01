import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

export enum PromocodeDiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

@Entity("tbl_promocodes")
export class PromocodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: PromocodeDiscountType })
  discountType: PromocodeDiscountType;

  @Column("decimal", { precision: 10, scale: 2 })
  discountValue: number;

  @Column({ type: 'int', nullable: true })
  maxUses?: number;

  @Column({ type: 'int', default: 0 })
  currentUses: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  minOrderAmount?: number;

  @Column({ type: 'timestamp', nullable: true })
  startsAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ default: true })
  isActive: boolean;

  // Optional list of product IDs this promocode applies to
  // Stored as a simple comma-separated list for portability
  @Column('simple-array', { nullable: true })
  productIds?: number[];

  @Column({ nullable: false })
  companyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}