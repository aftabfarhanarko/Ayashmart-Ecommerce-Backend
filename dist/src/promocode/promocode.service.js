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
exports.PromocodeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const promocode_entity_1 = require("./entities/promocode.entity");
let PromocodeService = class PromocodeService {
    constructor(promoRepo) {
        this.promoRepo = promoRepo;
    }
    async create(dto, companyId) {
        if (!companyId) {
            throw new common_1.NotFoundException('CompanyId is required');
        }
        const exists = await this.promoRepo.findOne({ where: { code: dto.code, companyId } });
        if (exists)
            throw new common_1.BadRequestException('Promocode already exists');
        const startsAt = dto.startsAt ? new Date(dto.startsAt) : undefined;
        const expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : undefined;
        if (startsAt && expiresAt && startsAt > expiresAt) {
            throw new common_1.BadRequestException('startsAt must be before expiresAt');
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
    async findAll(companyId) {
        return this.promoRepo.find({
            where: { companyId },
            order: { id: 'DESC' },
        });
    }
    async findPublic(companyId) {
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
    async findOne(id, companyId) {
        const promo = await this.promoRepo.findOne({ where: { id, companyId } });
        if (!promo)
            throw new common_1.NotFoundException('Promocode not found');
        return promo;
    }
    async update(id, dto, companyId) {
        const promo = await this.findOne(id, companyId);
        if (dto.code && dto.code !== promo.code) {
            const exists = await this.promoRepo.findOne({ where: { code: dto.code, companyId } });
            if (exists)
                throw new common_1.BadRequestException('Promocode already exists');
            promo.code = dto.code;
        }
        if (dto.description !== undefined)
            promo.description = dto.description;
        if (dto.discountType !== undefined)
            promo.discountType = dto.discountType;
        if (dto.discountValue !== undefined)
            promo.discountValue = dto.discountValue;
        if (dto.maxUses !== undefined)
            promo.maxUses = dto.maxUses;
        if (dto.minOrderAmount !== undefined)
            promo.minOrderAmount = dto.minOrderAmount;
        if (dto.productIds !== undefined) {
            promo.productIds = dto.productIds;
        }
        if (dto.startsAt !== undefined)
            promo.startsAt = dto.startsAt ? new Date(dto.startsAt) : undefined;
        if (dto.expiresAt !== undefined)
            promo.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : undefined;
        if (promo.startsAt && promo.expiresAt && promo.startsAt > promo.expiresAt) {
            throw new common_1.BadRequestException('startsAt must be before expiresAt');
        }
        if (dto.isActive !== undefined)
            promo.isActive = dto.isActive;
        promo.companyId = companyId;
        return this.promoRepo.save(promo);
    }
    async remove(id, companyId) {
        const promo = await this.findOne(id, companyId);
        const res = await this.promoRepo.softDelete(id);
        if (!res.affected)
            throw new common_1.NotFoundException('Promocode not found');
    }
    async toggleActive(id, active, companyId) {
        const promo = await this.findOne(id, companyId);
        promo.isActive = active;
        return this.promoRepo.save(promo);
    }
};
exports.PromocodeService = PromocodeService;
exports.PromocodeService = PromocodeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(promocode_entity_1.PromocodeEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PromocodeService);
//# sourceMappingURL=promocode.service.js.map