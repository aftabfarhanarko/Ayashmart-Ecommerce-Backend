import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CreateRefundPolicyDto } from './dto/create-refund-policy.dto';
import { UpdateRefundPolicyDto } from './dto/update-refund-policy.dto';
import { RefundPolicy } from './entities/refund-policy.entity';

@Injectable()
export class RefundPolicyService {
  constructor(
    @InjectRepository(RefundPolicy)
    private readonly refundPolicyRepo: Repository<RefundPolicy>,
  ) { }

  async create(createRefundPolicyDto: CreateRefundPolicyDto, companyId: string) {
    if (!companyId) {
      throw new NotFoundException('CompanyId is required');
    }
    const entity = this.refundPolicyRepo.create({
      content: createRefundPolicyDto.content,
      companyId: companyId,
    });
    return this.refundPolicyRepo.save(entity);
  }

  async findAll(companyId: string) {
    return this.refundPolicyRepo.find({
      where: { companyId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, companyId: string) {
    const entity = await this.refundPolicyRepo.findOne({ where: { id, companyId, deletedAt: IsNull() } });
    if (!entity) throw new NotFoundException(`Refund Policy ${id} not found`);
    return entity;
  }

  async update(id: number, updateRefundPolicyDto: UpdateRefundPolicyDto, companyId: string) {
    const entity = await this.findOne(id, companyId);
    const merged = this.refundPolicyRepo.merge(entity, updateRefundPolicyDto);
    // Ensure companyId is preserved
    merged.companyId = companyId;
    return this.refundPolicyRepo.save(merged);
  }

  async remove(id: number, companyId: string) {
    const entity = await this.findOne(id, companyId);
    await this.refundPolicyRepo.softRemove(entity);
    return { success: true };
  }
}
