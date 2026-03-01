import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TopProductsSectionEntity } from './entities/top-products-section.entity';
import { TopProductsItemEntity } from './entities/top-products-item.entity';
import { UpdateTopProductsSectionDto } from './dto/update-top-products-section.dto';
import { CreateTopProductsItemDto } from './dto/create-top-products-item.dto';
import { UpdateTopProductsItemDto } from './dto/update-top-products-item.dto';

export type TopProductItem = {
  id: number;
  title: string;
  desc: string;
  image: string;
  isActive: boolean;
  order: number;
};

export type TopProductSection = {
  leftImage: string | null;
  rightImage: string | null;
  carouselItems: TopProductItem[];
};

@Injectable()
export class TopProductsService {
  constructor(
    @InjectRepository(TopProductsSectionEntity)
    private readonly sectionRepo: Repository<TopProductsSectionEntity>,
    @InjectRepository(TopProductsItemEntity)
    private readonly itemRepo: Repository<TopProductsItemEntity>,
  ) {}

  private async ensureSection(companyId: string): Promise<TopProductsSectionEntity> {
    if (!companyId) throw new BadRequestException('CompanyId is required');
    const existing = await this.sectionRepo.findOne({ where: { companyId } });
    if (existing) return existing;
    const created = this.sectionRepo.create({
      companyId,
      leftImageUrl: null,
      rightImageUrl: null,
    });
    return this.sectionRepo.save(created);
  }

  private mapSection(section: TopProductsSectionEntity, items: TopProductsItemEntity[]): TopProductSection {
    return {
      leftImage: section.leftImageUrl ?? null,
      rightImage: section.rightImageUrl ?? null,
      carouselItems: items.map((i) => ({
        id: i.id,
        title: i.title,
        desc: i.desc,
        image: i.imageUrl,
        isActive: i.isActive,
        order: i.order,
      })),
    };
  }

  async getTopProductsPublic(companyId: string): Promise<TopProductSection> {
    const section = await this.ensureSection(companyId);
    const items = await this.itemRepo.find({
      where: { companyId, isActive: true },
      order: { order: 'ASC', id: 'ASC' },
    });
    return this.mapSection(section, items);
  }

  async getTopProductsAdmin(companyId: string): Promise<TopProductSection> {
    const section = await this.ensureSection(companyId);
    const items = await this.itemRepo.find({
      where: { companyId },
      order: { order: 'ASC', id: 'ASC' },
    });
    return this.mapSection(section, items);
  }

  async updateSection(companyId: string, dto: UpdateTopProductsSectionDto): Promise<TopProductsSectionEntity> {
    const section = await this.ensureSection(companyId);
    if (dto.leftImageUrl !== undefined) section.leftImageUrl = dto.leftImageUrl;
    if (dto.rightImageUrl !== undefined) section.rightImageUrl = dto.rightImageUrl;
    return this.sectionRepo.save(section);
  }

  async createItem(companyId: string, dto: CreateTopProductsItemDto): Promise<TopProductsItemEntity> {
    if (!companyId) throw new BadRequestException('CompanyId is required');
    const item = this.itemRepo.create({
      companyId,
      title: dto.title ?? null,
      desc: dto.desc ?? null,
      imageUrl: dto.imageUrl,
      isActive: dto.isActive ?? true,
      order: dto.order ?? 0,
    });
    return this.itemRepo.save(item);
  }

  async updateItem(companyId: string, id: number, dto: UpdateTopProductsItemDto): Promise<TopProductsItemEntity> {
    if (!companyId) throw new BadRequestException('CompanyId is required');
    const item = await this.itemRepo.findOne({ where: { id, companyId } });
    if (!item) throw new NotFoundException('Top product item not found');
    Object.assign(item, {
      title: dto.title ?? item.title,
      desc: dto.desc ?? item.desc,
      imageUrl: dto.imageUrl ?? item.imageUrl,
      isActive: dto.isActive ?? item.isActive,
      order: dto.order ?? item.order,
    });
    return this.itemRepo.save(item);
  }

  async removeItem(companyId: string, id: number): Promise<void> {
    if (!companyId) throw new BadRequestException('CompanyId is required');
    const item = await this.itemRepo.findOne({ where: { id, companyId } });
    if (!item) throw new NotFoundException('Top product item not found');
    await this.itemRepo.delete({ id, companyId });
  }
}

