import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: true })
  customer?: User;

  @Column({ nullable: true })
  customerName?: string;

  @Column({ nullable: true })
  customerPhone?: string;

  @Column({ nullable: true })
  customerEmail?: string;

  @Column({ nullable: true })
  customerAddress?: string;

  @Column('json', { nullable: true })
  items: Array<{
    productId: number;
    resellerId?: number;
    product?: {
      id: number;
      name: string;
      sku?: string;
      images?: Array<{ url: string; isPrimary?: boolean }>;
    };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;

  @Column("decimal", { precision: 12, scale: 2, default: 0 })
  totalAmount: number;

  @Column("decimal", { precision: 12, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ default: "pending" })
  status: "pending" | "processing" | "paid" | "shipped" | "delivered" | "cancelled" | "refunded" | "incomplete";

  @Column({ nullable: true })
  paymentReference?: string;

  @Column('json', { nullable: true })
  orderInfo?: string;

  @Column({ default: "DIRECT" })
  paymentMethod: "DIRECT" | "COD";

  @Column({ nullable: true })
  shippingTrackingId?: string;

  @Column({ nullable: true })
  shippingProvider?: string;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ nullable: false })
  companyId: string;

  @Column({ default: "INSIDEDHAKA" })
  deliveryType: "INSIDEDHAKA" | "OUTSIDEDHAKA";

  @Column({ nullable: true })
  deliveryNote?: string;

  @Column({ nullable: true })
  cancelNote?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
