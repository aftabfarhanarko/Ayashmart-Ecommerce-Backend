import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tbl_media')
export class MediaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  size: string;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: false })
  companyId: string;

  @Column({ nullable: true })
  filename: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
