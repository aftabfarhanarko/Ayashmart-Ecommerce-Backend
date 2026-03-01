import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ProductEntity } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

@Entity('tbl_reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductEntity, { nullable: false })
  product: ProductEntity;

  @ManyToOne(() => User, { nullable: true })
  user?: User;

  @Column({ type: 'int', default: 5 })
  rating: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'text', nullable: true })
  reply?: string;

  @Column({ nullable: false })
  companyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
