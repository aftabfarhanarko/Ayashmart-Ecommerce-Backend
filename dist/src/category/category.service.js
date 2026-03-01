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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("./entities/category.entity");
const activity_log_service_1 = require("../systemuser/activity-log.service");
const activity_log_entity_1 = require("../systemuser/entities/activity-log.entity");
const cache_manager_1 = require("@nestjs/cache-manager");
let CategoryService = class CategoryService {
    constructor(categoryRepository, activityLogService, dataSource, cacheManager) {
        this.categoryRepository = categoryRepository;
        this.activityLogService = activityLogService;
        this.dataSource = dataSource;
        this.cacheManager = cacheManager;
    }
    async clearCache(companyId) {
        try {
            await this.cacheManager.del(`categories:company_${companyId}`);
            await this.cacheManager.del(`categories:company_${companyId}:public`);
        }
        catch (error) {
            console.error('Failed to clear category cache:', error);
        }
    }
    generateSlug(name) {
        return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }
    async create(createDto, companyId, performedByUserId, resellerId) {
        const category = this.categoryRepository.create({
            name: createDto.name,
            slug: this.generateSlug(createDto.name),
            isActive: createDto.isActive ?? true,
            photo: createDto.photo,
            companyId,
            resellerId,
        });
        if (createDto.parentId) {
            const parent = await this.categoryRepository.findOne({
                where: { id: createDto.parentId, companyId }
            });
            if (!parent)
                throw new common_1.NotFoundException("Parent category not found");
            category.parent = parent;
        }
        const saved = await this.categoryRepository.save(category);
        if (performedByUserId) {
            try {
                await this.activityLogService.logActivity({
                    companyId,
                    action: activity_log_entity_1.ActivityAction.CREATE,
                    entity: activity_log_entity_1.ActivityEntity.CATEGORY,
                    entityId: saved.id,
                    entityName: saved.name,
                    description: `Created category: ${saved.name}`,
                    newValues: { name: saved.name, slug: saved.slug },
                    performedByUserId,
                });
            }
            catch (e) {
                console.error('Failed to log activity:', e);
            }
        }
        await this.clearCache(companyId);
        return saved;
    }
    async findAll(companyId, resellerId) {
        const cacheKey = `categories:company_${companyId}:${resellerId ?? 'all'}`;
        try {
            const cached = await this.cacheManager.get(cacheKey);
            if (cached)
                return cached;
        }
        catch (e) {
            console.error('Cache get error:', e);
        }
        const where = { deletedAt: (0, typeorm_2.IsNull)(), companyId };
        if (resellerId) {
            where.resellerId = resellerId;
        }
        const categories = await this.categoryRepository.find({
            where,
            relations: ["parent", "children"],
        });
        const result = categories.map(cat => ({
            ...cat,
            slug: cat.slug ? cat.slug.toLowerCase() : this.generateSlug(cat.name),
        }));
        try {
            await this.cacheManager.set(cacheKey, result, 3600 * 1000);
        }
        catch (e) {
            console.error('Cache set error:', e);
        }
        return result;
    }
    async findPublic(companyId) {
        const cacheKey = `categories:company_${companyId}:public`;
        try {
            const cached = await this.cacheManager.get(cacheKey);
            if (cached)
                return cached;
        }
        catch (e) {
            console.error('Cache get error:', e);
        }
        const categories = await this.categoryRepository.find({
            select: {
                id: true,
                name: true,
                slug: true,
                photo: true,
                isActive: true,
                children: {
                    id: true,
                    name: true,
                    slug: true,
                    photo: true,
                },
            },
            where: {
                deletedAt: (0, typeorm_2.IsNull)(),
                companyId,
                isActive: true,
                parent: (0, typeorm_2.IsNull)(),
            },
            relations: ["children"],
        });
        try {
            await this.cacheManager.set(cacheKey, categories, 3600 * 1000);
        }
        catch (e) {
            console.error('Cache set error:', e);
        }
        return categories;
    }
    async findOne(id, companyId) {
        const category = await this.categoryRepository.findOne({
            where: { id, deletedAt: (0, typeorm_2.IsNull)(), companyId },
            relations: ["parent", "children"],
        });
        if (!category)
            throw new common_1.NotFoundException("Category not found");
        category.slug = category.slug ? category.slug.toLowerCase() : this.generateSlug(category.name);
        return category;
    }
    async update(id, updateDto, companyId, performedByUserId) {
        const category = await this.findOne(id, companyId);
        const oldValues = { name: category.name, slug: category.slug, isActive: category.isActive };
        if (updateDto.name !== undefined) {
            category.name = updateDto.name;
            category.slug = this.generateSlug(updateDto.name);
        }
        if (updateDto.photo !== undefined)
            category.photo = updateDto.photo;
        if (updateDto.isActive !== undefined)
            category.isActive = updateDto.isActive;
        if (updateDto.parentId !== undefined) {
            if (updateDto.parentId === null) {
                category.parent = null;
            }
            else {
                const parent = await this.categoryRepository.findOne({
                    where: { id: updateDto.parentId, companyId }
                });
                if (!parent)
                    throw new common_1.NotFoundException("Parent category not found");
                if (parent.id === id)
                    throw new common_1.BadRequestException("Category cannot be its own parent");
                category.parent = parent;
            }
        }
        const saved = await this.categoryRepository.save(category);
        if (performedByUserId) {
            try {
                await this.activityLogService.logActivity({
                    companyId,
                    action: activity_log_entity_1.ActivityAction.UPDATE,
                    entity: activity_log_entity_1.ActivityEntity.CATEGORY,
                    entityId: saved.id,
                    entityName: saved.name,
                    description: `Updated category: ${saved.name}`,
                    oldValues,
                    newValues: { name: saved.name, slug: saved.slug, isActive: saved.isActive },
                    performedByUserId,
                });
            }
            catch (e) {
                console.error('Failed to log activity:', e);
            }
        }
        await this.clearCache(companyId);
        return saved;
    }
    async softDelete(id, companyId, performedByUserId) {
        const category = await this.findOne(id, companyId);
        if (performedByUserId) {
            try {
                await this.activityLogService.logActivity({
                    companyId,
                    action: activity_log_entity_1.ActivityAction.DELETE,
                    entity: activity_log_entity_1.ActivityEntity.CATEGORY,
                    entityId: category.id,
                    entityName: category.name,
                    description: `Deleted category: ${category.name}`,
                    performedByUserId,
                });
            }
            catch (e) {
                console.error('Failed to log activity:', e);
            }
        }
        await this.categoryRepository.softRemove(category);
        await this.clearCache(companyId);
    }
    async listTrashed(companyId) {
        return this.categoryRepository
            .createQueryBuilder("category")
            .withDeleted()
            .leftJoinAndSelect("category.parent", "parent")
            .leftJoinAndSelect("category.children", "children")
            .where("category.companyId = :companyId", { companyId })
            .andWhere("category.deletedAt IS NOT NULL")
            .orderBy("category.deletedAt", "DESC")
            .getMany();
    }
    async restore(id, companyId, performedByUserId) {
        const category = await this.categoryRepository.findOne({
            where: { id, companyId },
            withDeleted: true,
            relations: ["parent", "children"],
        });
        if (!category)
            throw new common_1.NotFoundException("Category not found");
        if (!category.deletedAt)
            return category;
        await this.categoryRepository.recover(category);
        const restored = await this.findOne(id, companyId);
        if (performedByUserId) {
            try {
                await this.activityLogService.logActivity({
                    companyId,
                    action: activity_log_entity_1.ActivityAction.UPDATE,
                    entity: activity_log_entity_1.ActivityEntity.CATEGORY,
                    entityId: restored.id,
                    entityName: restored.name,
                    description: `Restored category: ${restored.name}`,
                    performedByUserId,
                });
            }
            catch (e) {
                console.error('Failed to log activity:', e);
            }
        }
        await this.clearCache(companyId);
        return restored;
    }
    async hardDeleteTrashedOlderThanDays(days) {
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const repo = this.dataSource.getRepository(category_entity_1.CategoryEntity);
        const rawIds = await repo
            .createQueryBuilder("category")
            .withDeleted()
            .select("category.id", "id")
            .where("category.deletedAt IS NOT NULL")
            .andWhere("category.deletedAt < :cutoff", { cutoff })
            .getRawMany();
        const idsToDelete = rawIds.map((r) => +r.id).filter((id) => Number.isFinite(id));
        if (idsToDelete.length === 0)
            return 0;
        return await this.dataSource.transaction(async (manager) => {
            await manager
                .createQueryBuilder()
                .update(category_entity_1.CategoryEntity)
                .set({ parent: null })
                .where("parentId IN (:...ids)", { ids: idsToDelete })
                .execute();
            const res = await manager
                .createQueryBuilder()
                .delete()
                .from(category_entity_1.CategoryEntity)
                .where("id IN (:...ids)", { ids: idsToDelete })
                .execute();
            return res.affected ?? 0;
        });
    }
    async toggleActive(id, active, companyId) {
        const category = await this.findOne(id, companyId);
        category.isActive = active !== undefined ? active : !category.isActive;
        const saved = await this.categoryRepository.save(category);
        await this.clearCache(companyId);
        return saved;
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.CategoryEntity)),
    __param(3, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        activity_log_service_1.ActivityLogService,
        typeorm_2.DataSource, Object])
], CategoryService);
//# sourceMappingURL=category.service.js.map