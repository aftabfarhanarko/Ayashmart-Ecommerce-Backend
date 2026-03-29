import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('tbl_cash_expenses')
export class CashExpense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyId: string;

  @Column()
  title: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'date' })
  date: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
