import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('super_admins')
export class SuperAdmin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  designation: string;

  /**
   * Stored as a salted hash – never return this field from APIs.
   */
  @Column({ nullable: false })
  passwordHash: string;

  @Column({ nullable: false })
  passwordSalt: string;

  @Column({ nullable: true })
  photo: string;

  @Column('json', { nullable: true, default: [] })
  permissions: string[];

  @Column({ default: 'SUPER_ADMIN' })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
