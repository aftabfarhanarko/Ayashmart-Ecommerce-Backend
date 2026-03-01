"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const package_entity_1 = require("./entities/package.entity");
let PackageService = class PackageService {
    constructor(packageRepo) {
        this.packageRepo = packageRepo;
    }
    async create(createPackageDto) {
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
    async findOne(id) {
        const entity = await this.packageRepo.findOne({
            where: { id },
            relations: ['theme'],
        });
        if (!entity) {
            throw new common_1.NotFoundException(`Package with ID ${id} not found`);
        }
        return entity;
    }
    async update(id, updatePackageDto) {
        const entity = await this.packageRepo.findOne({ where: { id } });
        if (!entity) {
            throw new common_1.NotFoundException(`Package with ID ${id} not found`);
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
    async remove(id) {
        const entity = await this.packageRepo.findOne({ where: { id } });
        if (!entity) {
            throw new common_1.NotFoundException(`Package with ID ${id} not found`);
        }
        await this.packageRepo.softRemove(entity);
        return { success: true };
    }
};
exports.PackageService = PackageService;
exports.PackageService = PackageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(package_entity_1.Package)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PackageService);
//# sourceMappingURL=package.service.js.map