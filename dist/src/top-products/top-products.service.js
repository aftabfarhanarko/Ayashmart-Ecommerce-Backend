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
exports.TopProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const top_products_section_entity_1 = require("./entities/top-products-section.entity");
const top_products_item_entity_1 = require("./entities/top-products-item.entity");
let TopProductsService = class TopProductsService {
    constructor(sectionRepo, itemRepo) {
        this.sectionRepo = sectionRepo;
        this.itemRepo = itemRepo;
    }
    async ensureSection(companyId) {
        if (!companyId)
            throw new common_1.BadRequestException('CompanyId is required');
        const existing = await this.sectionRepo.findOne({ where: { companyId } });
        if (existing)
            return existing;
        const created = this.sectionRepo.create({
            companyId,
            leftImageUrl: null,
            rightImageUrl: null,
        });
        return this.sectionRepo.save(created);
    }
    mapSection(section, items) {
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
    async getTopProductsPublic(companyId) {
        const section = await this.ensureSection(companyId);
        const items = await this.itemRepo.find({
            where: { companyId, isActive: true },
            order: { order: 'ASC', id: 'ASC' },
        });
        return this.mapSection(section, items);
    }
    async getTopProductsAdmin(companyId) {
        const section = await this.ensureSection(companyId);
        const items = await this.itemRepo.find({
            where: { companyId },
            order: { order: 'ASC', id: 'ASC' },
        });
        return this.mapSection(section, items);
    }
    async updateSection(companyId, dto) {
        const section = await this.ensureSection(companyId);
        if (dto.leftImageUrl !== undefined)
            section.leftImageUrl = dto.leftImageUrl;
        if (dto.rightImageUrl !== undefined)
            section.rightImageUrl = dto.rightImageUrl;
        return this.sectionRepo.save(section);
    }
    async createItem(companyId, dto) {
        if (!companyId)
            throw new common_1.BadRequestException('CompanyId is required');
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
    async updateItem(companyId, id, dto) {
        if (!companyId)
            throw new common_1.BadRequestException('CompanyId is required');
        const item = await this.itemRepo.findOne({ where: { id, companyId } });
        if (!item)
            throw new common_1.NotFoundException('Top product item not found');
        Object.assign(item, {
            title: dto.title ?? item.title,
            desc: dto.desc ?? item.desc,
            imageUrl: dto.imageUrl ?? item.imageUrl,
            isActive: dto.isActive ?? item.isActive,
            order: dto.order ?? item.order,
        });
        return this.itemRepo.save(item);
    }
    async removeItem(companyId, id) {
        if (!companyId)
            throw new common_1.BadRequestException('CompanyId is required');
        const item = await this.itemRepo.findOne({ where: { id, companyId } });
        if (!item)
            throw new common_1.NotFoundException('Top product item not found');
        await this.itemRepo.delete({ id, companyId });
    }
};
exports.TopProductsService = TopProductsService;
exports.TopProductsService = TopProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(top_products_section_entity_1.TopProductsSectionEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(top_products_item_entity_1.TopProductsItemEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TopProductsService);
//# sourceMappingURL=top-products.service.js.map