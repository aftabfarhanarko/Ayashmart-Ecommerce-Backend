import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export enum SupportStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
}

@Entity('tbl_support')
export class Help {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ type: 'text' })
  issue: string;

  @Column({ type: 'varchar', default: SupportStatus.PENDING })
  status: SupportStatus;

  @Column({ nullable: false })
  companyId: string;

  @Column({ type: 'varchar', nullable: true, default: 'medium' })
  priority: string;

  /** Tags as JSON array of strings, e.g. ["billing", "urgent"] */
  @Column('json', { nullable: true, default: [] })
  tags: string[];

  /** Attachment URLs or storage keys as JSON array */
  @Column('json', { nullable: true, default: [] })
  attachments: string[];

  /** Replies from system user (store owner) or superadmin. [{ message, author, createdAt }] */
  @Column('json', { nullable: true, default: [] })
  replies: Array<{ message: string; author: string; createdAt: string }>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}