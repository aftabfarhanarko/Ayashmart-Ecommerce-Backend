import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SystemUser } from './systemuser.entity';

export enum ActivityAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  PERMISSION_ASSIGN = 'PERMISSION_ASSIGN',
  PERMISSION_REVOKE = 'PERMISSION_REVOKE',
  STATUS_CHANGE = 'STATUS_CHANGE',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  BARCODE_SCAN = 'BARCODE_SCAN',
}

export enum ActivityEntity {
  SYSTEM_USER = 'SYSTEM_USER',
  PRODUCT = 'PRODUCT',
  ORDER = 'ORDER',
  CATEGORY = 'CATEGORY',
  CUSTOMER = 'CUSTOMER',
  INVENTORY = 'INVENTORY',
  BANNER = 'BANNER',
  PROMOCODE = 'PROMOCODE',
}

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  companyId: string;

  @Column({
    type: 'enum',
    enum: ActivityAction,
    nullable: false,
  })
  action: ActivityAction;

  @Column({
    type: 'enum',
    enum: ActivityEntity,
    nullable: false,
  })
  entity: ActivityEntity;

  @Column({ nullable: true })
  entityId: number;

  @Column({ nullable: true })
  entityName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  oldValues: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  newValues: Record<string, any>;

  @Column({ nullable: false })
  performedByUserId: number;

  @ManyToOne(() => SystemUser, { nullable: false })
  @JoinColumn({ name: 'performedByUserId' })
  performedBy: SystemUser;

  @Column({ nullable: true })
  targetUserId: number;

  @ManyToOne(() => SystemUser, { nullable: true })
  @JoinColumn({ name: 'targetUserId' })
  targetUser: SystemUser;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;
}
