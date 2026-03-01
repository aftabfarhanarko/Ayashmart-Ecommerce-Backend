import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from './entities/package.entity';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepo: Repository<Package>,
  ) {}

  async create(createPackageDto: CreatePackageDto) {
    if (!createPackageDto) {
      throw new Error('Package data is required');
    }

    const entity = this.packageRepo.create({
      name: createPackageDto.name,
      description: createPackageDto.description,
      price: createPackageDto.price,
      ...(createPackageDto.discountPrice !== undefined && { discountPrice: createPackageDto.discountPrice }),
      isFeatured: createPackageDto.isFeatured ?? false,
      features: createPackageDto.features ?? [],
      ...(createPackageDto.themeId !== undefined && { themeId: createPackageDto.themeId }),
    });

    return await this.packageRepo.save(entity);
  }

  async findAll() {
    return await this.packageRepo.find({ 
      order: { id: 'DESC' },
      relations: ['theme'],
    });
  }

  async findOne(id: number) {
    const entity = await this.packageRepo.findOne({ 
      where: { id },
      relations: ['theme'],
    });
    if (!entity) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
    return entity;
  }

  async update(id: number, updatePackageDto: UpdatePackageDto) {
    const entity = await this.packageRepo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    if (updatePackageDto.name !== undefined) {
      entity.name = updatePackageDto.name;
    }
    if (updatePackageDto.description !== undefined) {
      entity.description = updatePackageDto.description;
    }
    if (updatePackageDto.price !== undefined) {
      entity.price = updatePackageDto.price;
    }
    if (updatePackageDto.discountPrice !== undefined) {
      entity.discountPrice = updatePackageDto.discountPrice;
    }
    if (updatePackageDto.isFeatured !== undefined) {
      entity.isFeatured = updatePackageDto.isFeatured;
    }
    if (updatePackageDto.features !== undefined) {
      entity.features = updatePackageDto.features;
    }
    if (updatePackageDto.themeId !== undefined) {
      entity.themeId = updatePackageDto.themeId;
    }

    return await this.packageRepo.save(entity);
  }

  async remove(id: number) {
    const entity = await this.packageRepo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
    await this.packageRepo.softRemove(entity);
    return { success: true };
  }
}
