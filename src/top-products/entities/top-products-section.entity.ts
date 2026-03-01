import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('tbl_top_products_section')
@Index(['companyId'], { unique: true })
export class TopProductsSectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  leftImageUrl: string;

  @Column({ nullable: true })
  rightImageUrl: string;

  @Column({ nullable: false })
  companyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

