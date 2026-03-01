import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>,
  ) {}
  create(createSettingDto: CreateSettingDto) {
    const entity = this.settingRepo.create(createSettingDto);
    return this.settingRepo.save(entity);
  }

  async findAll() {
    return this.settingRepo.find();
  }

  async findOne(id: number) {
    const entity = await this.settingRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Setting ${id} not found`);
    return entity;
  }

  async update(id: number, updateSettingDto: UpdateSettingDto) {
    const entity = await this.findOne(id);
    const merged = this.settingRepo.merge(entity, updateSettingDto);
    return this.settingRepo.save(merged);
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    await this.settingRepo.softRemove(entity);
    return { success: true };
  }
}
