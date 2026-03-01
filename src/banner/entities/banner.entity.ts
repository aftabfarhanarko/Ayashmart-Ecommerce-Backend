import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'; 

@Entity('tbl_banners')
export class BannerEntity {
  @PrimaryGeneratedColumn()
  id: number;


  @Column({ nullable: true })
  title: string;


  @Column({ nullable: true })
  subtitle: string;

  
  @Column({ nullable: false })
  imageUrl: string;


  @Column({ nullable: true })
  buttonText: string;


  @Column({ nullable: true })
  buttonLink: string;


  @Column({ default: true })
  isActive: boolean;


  @Column({ default: 0 })
  order: number;

  @Column({ nullable: false })
  companyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}