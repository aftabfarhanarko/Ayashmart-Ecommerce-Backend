import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePrivecyPolicyDto } from './dto/create-privecy-policy.dto';
import { UpdatePrivecyPolicyDto } from './dto/update-privecy-policy.dto';
import { PrivecyPolicy } from './entities/privecy-policy.entity';

@Injectable()

export class PrivecyPolicyService {
  constructor(
    @InjectRepository(PrivecyPolicy)
    private readonly privacyPolicyRepo: Repository<PrivecyPolicy>,
  ) { }

  async create(createPrivecyPolicyDto: CreatePrivecyPolicyDto, companyId: string) {
    if (!companyId) {
      throw new NotFoundException('CompanyId is required');
    }
    const entity = this.privacyPolicyRepo.create({
      content: createPrivecyPolicyDto.content,
      companyId: companyId,
    });
    return this.privacyPolicyRepo.save(entity);
  }

  async findAll(companyId: string) {
    return this.privacyPolicyRepo.find({
      where: { companyId },
      order: { createdAt: 'DESC' },
    });
  }

  async findPublic(companyId: string) {
    return this.findAll(companyId);
  }

  async findOne(id: number, companyId: string) {
    const entity = await this.privacyPolicyRepo.findOne({ where: { id, companyId } });
    if (!entity) throw new NotFoundException(`Privacy Policy ${id} not found`);
    return entity;
  }

  async update(id: number, updatePrivecyPolicyDto: UpdatePrivecyPolicyDto, companyId: string) {
    const entity = await this.findOne(id, companyId);
    const merged = this.privacyPolicyRepo.merge(entity, updatePrivecyPolicyDto);
    // Ensure companyId is preserved
    merged.companyId = companyId;
    return this.privacyPolicyRepo.save(merged);
  }

  async remove(id: number, companyId: string) {
    const entity = await this.findOne(id, companyId);
    await this.privacyPolicyRepo.softRemove(entity);
    return { success: true };
  }
}
