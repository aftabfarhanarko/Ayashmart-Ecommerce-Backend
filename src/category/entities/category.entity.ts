import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity("tbl_categories")
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: false })
  companyId: string;

  @Column({ nullable: true })
  resellerId?: number;

  @ManyToOne(() => CategoryEntity, (cat) => cat.children, { nullable: true })
  parent: CategoryEntity | null;

  @OneToMany(() => CategoryEntity, (cat) => cat.parent)
  children: CategoryEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;  // Soft delete timestamp
}
