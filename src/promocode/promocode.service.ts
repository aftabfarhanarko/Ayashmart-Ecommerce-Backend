import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreatePromocodeDto } from './dto/create-promocode.dto';
import { UpdatePromocodeDto } from './dto/update-promocode.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromocodeEntity, PromocodeDiscountType } from './entities/promocode.entity';

@Injectable()
export class PromocodeService {
  constructor(
    @InjectRepository(PromocodeEntity)
    private readonly promoRepo: Repository<PromocodeEntity>,
  ) { }

  async create(dto: CreatePromocodeDto, companyId: string) {
    if (!companyId) {
      throw new NotFoundException('CompanyId is required');
    }

    const exists = await this.promoRepo.findOne({ where: { code: dto.code, companyId } });
    if (exists) throw new BadRequestException('Promocode already exists');

    const startsAt = dto.startsAt ? new Date(dto.startsAt) : undefined;
    const expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : undefined;

    if (startsAt && expiresAt && startsAt > expiresAt) {
      throw new BadRequestException('startsAt must be before expiresAt');
    }

    const promo = this.promoRepo.create({
      code: dto.code,
      description: dto.description,
      discountType: dto.discountType,
      discountValue: dto.discountValue,
      maxUses: dto.maxUses,
      currentUses: 0,
      minOrderAmount: dto.minOrderAmount,
      startsAt,
      expiresAt,
      isActive: dto.isActive ?? true,
      companyId: companyId,
      productIds: dto.productIds,
    });

    return this.promoRepo.save(promo);
  }

  async findAll(companyId: string) {
    return this.promoRepo.find({
      where: { companyId },
      order: { id: 'DESC' },
    });
  }

  async findPublic(companyId: string) {
    const now = new Date();
    return this.promoRepo
      .createQueryBuilder('p')
      .where('p.companyId = :companyId', { companyId })
      .andWhere('p.isActive = true')
      .andWhere('(p.startsAt IS NULL OR p.startsAt <= :now)', { now })
      .andWhere('(p.expiresAt IS NULL OR p.expiresAt >= :now)', { now })
      .andWhere('(p.maxUses IS NULL OR p.currentUses < p.maxUses)')
      .orderBy('p.id', 'DESC')
      .getMany();
  }

  async findOne(id: number, companyId: string) {
    const promo = await this.promoRepo.findOne({ where: { id, companyId } });
    if (!promo) throw new NotFoundException('Promocode not found');
    return promo;
  }

  async update(id: number, dto: UpdatePromocodeDto, companyId: string) {
    const promo = await this.findOne(id, companyId);

    if (dto.code && dto.code !== promo.code) {
      const exists = await this.promoRepo.findOne({ where: { code: dto.code, companyId } });
      if (exists) throw new BadRequestException('Promocode already exists');
      promo.code = dto.code;
    }

    if (dto.description !== undefined) promo.description = dto.description;
    if (dto.discountType !== undefined) promo.discountType = dto.discountType as PromocodeDiscountType;
    if (dto.discountValue !== undefined) promo.discountValue = dto.discountValue as any;
    if (dto.maxUses !== undefined) promo.maxUses = dto.maxUses as any;
    if (dto.minOrderAmount !== undefined) promo.minOrderAmount = dto.minOrderAmount as any;

    if (dto.productIds !== undefined) {
      promo.productIds = dto.productIds as any;
    }

    if (dto.startsAt !== undefined) promo.startsAt = dto.startsAt ? new Date(dto.startsAt) : undefined;
    if (dto.expiresAt !== undefined) promo.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : undefined;

    if (promo.startsAt && promo.expiresAt && promo.startsAt > promo.expiresAt) {
      throw new BadRequestException('startsAt must be before expiresAt');
    }

    if (dto.isActive !== undefined) promo.isActive = dto.isActive as any;

    // Ensure companyId is preserved
    promo.companyId = companyId;

    return this.promoRepo.save(promo);
  }

  async remove(id: number, companyId: string) {
    const promo = await this.findOne(id, companyId);
    const res = await this.promoRepo.softDelete(id);
    if (!res.affected) throw new NotFoundException('Promocode not found');
  }

  async toggleActive(id: number, active: boolean, companyId: string) {
    const promo = await this.findOne(id, companyId);
    promo.isActive = active;
    return this.promoRepo.save(promo);
  }
}
