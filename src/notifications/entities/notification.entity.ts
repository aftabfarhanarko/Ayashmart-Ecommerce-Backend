import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum NotificationType {
  ORDER_CREATED = 'order_created',
  ORDER_CONFIRMED = 'order_confirmed',
  ORDER_PROCESSING = 'order_processing',
  ORDER_SHIPPED = 'order_shipped',
  ORDER_DELIVERED = 'order_delivered',
  ORDER_CANCELLED = 'order_cancelled',
  ORDER_REFUNDED = 'order_refunded',
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_FAILED = 'payment_failed',
  NEW_CUSTOMER = 'new_customer',
  CUSTOMER_UPDATED = 'customer_updated',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  PRODUCT_ADDED = 'product_added',
  PRODUCT_UPDATED = 'product_updated',
  BROADCAST_EMAIL = 'broadcast_email',
  BROADCAST_SMS = 'broadcast_sms',
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
}

@Entity('notifications')
@Index(['companyId', 'type'])
@Index(['companyId', 'createdAt'])
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  companyId: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ type: 'enum', enum: NotificationChannel })
  channel: NotificationChannel;

  @Column({ type: 'varchar', length: 255 })
  recipient: string;

  @Column({ type: 'text', nullable: true })
  subject?: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', length: 50, default: 'sent' })
  status: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'int', nullable: true })
  orderId?: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
