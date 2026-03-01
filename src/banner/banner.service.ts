import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BannerEntity } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepository: Repository<BannerEntity>,
  ) { }

  async create(dto: CreateBannerDto, companyId: string): Promise<BannerEntity> {
    if (!companyId) {
      throw new NotFoundException('CompanyId is required');
    }
    const banner = this.bannerRepository.create({
      ...dto,
      companyId: companyId,
    });
    return this.bannerRepository.save(banner);
  }

  async findAll(companyId: string): Promise<BannerEntity[]> {
    return this.bannerRepository.find({
      where: { companyId },
      order: { order: 'ASC' },
    });
  }

  async findOne(id: number, companyId: string): Promise<BannerEntity | null> {
    return this.bannerRepository.findOne({ where: { id, companyId } });
  }

  async update(id: number, dto: UpdateBannerDto, companyId: string): Promise<BannerEntity> {
    const banner = await this.bannerRepository.findOne({ where: { id, companyId } });
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    Object.assign(banner, dto);
    // Ensure companyId is preserved
    banner.companyId = companyId;
    return this.bannerRepository.save(banner);
  }

  async remove(id: number, companyId: string): Promise<void> {
    const banner = await this.findOne(id, companyId);
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    const result = await this.bannerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Banner not found');
    }
  }
}
