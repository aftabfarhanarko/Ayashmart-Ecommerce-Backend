import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTremsCondetionDto } from './dto/create-trems-condetion.dto';
import { UpdateTremsCondetionDto } from './dto/update-trems-condetion.dto';
import { TremsCondetion } from './entities/trems-condetion.entity';

@Injectable()
export class TremsCondetionsService {
  constructor(
    @InjectRepository(TremsCondetion)
    private readonly termsConditionsRepo: Repository<TremsCondetion>,
  ) { }

  async create(createTremsCondetionDto: CreateTremsCondetionDto, companyId: string) {
    if (!companyId) {
      throw new NotFoundException('CompanyId is required');
    }
    const entity = this.termsConditionsRepo.create({
      content: createTremsCondetionDto.content,
      companyId: companyId,
    });
    return this.termsConditionsRepo.save(entity);
  }

  async findAll(companyId: string) {
    return this.termsConditionsRepo.find({
      where: { companyId },
      order: { createdAt: 'DESC' },
    });
  }

  async findPublic(companyId: string) {
    return this.findAll(companyId);
  }

  async findOne(id: number, companyId: string) {
    const entity = await this.termsConditionsRepo.findOne({ where: { id, companyId } });
    if (!entity) throw new NotFoundException(`Terms & Conditions ${id} not found`);
    return entity;
  }

  async update(id: number, updateTremsCondetionDto: UpdateTremsCondetionDto, companyId: string) {
    const entity = await this.findOne(id, companyId);
    const merged = this.termsConditionsRepo.merge(entity, updateTremsCondetionDto);
    // Ensure companyId is preserved
    merged.companyId = companyId;
    return this.termsConditionsRepo.save(merged);
  }

  async remove(id: number, companyId: string) {
    const entity = await this.findOne(id, companyId);
    await this.termsConditionsRepo.softRemove(entity);
    return { success: true };
  }
}
