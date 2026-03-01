import { Injectable, NotFoundException, BadRequestException, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, IsNull, Repository } from "typeorm";

import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoryEntity } from "./entities/category.entity";
import { ActivityLogService } from "../systemuser/activity-log.service";
import { ActivityAction, ActivityEntity } from "../systemuser/entities/activity-log.entity";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    private readonly activityLogService: ActivityLogService,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  private async clearCache(companyId: string) {
    try {
      await this.cacheManager.del(`categories:company_${companyId}`);
      await this.cacheManager.del(`categories:company_${companyId}:public`);
    } catch (error) {
      console.error('Failed to clear category cache:', error);
    }
  }

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  async create(
    createDto: CreateCategoryDto,
    companyId: string,
    performedByUserId?: number,
    resellerId?: number,
  ): Promise<CategoryEntity> {
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
      if (!parent) throw new NotFoundException("Parent category not found");
      category.parent = parent;
    }

    const saved = await this.categoryRepository.save(category);
    if (performedByUserId) {
      try {
        await this.activityLogService.logActivity({
          companyId,
          action: ActivityAction.CREATE,
          entity: ActivityEntity.CATEGORY,
          entityId: saved.id,
          entityName: saved.name,
          description: `Created category: ${saved.name}`,
          newValues: { name: saved.name, slug: saved.slug },
          performedByUserId,
        });
      } catch (e) {
        console.error('Failed to log activity:', e);
      }
    }
    await this.clearCache(companyId);
    return saved;
  }

  async findAll(companyId: string, resellerId?: number): Promise<CategoryEntity[]> {
    const cacheKey = `categories:company_${companyId}:${resellerId ?? 'all'}`;
    try {
      const cached = await this.cacheManager.get<CategoryEntity[]>(cacheKey);
      if (cached) return cached;
    } catch (e) {
      console.error('Cache get error:', e);
    }

    const where: any = { deletedAt: IsNull(), companyId }; // only non-deleted
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
      await this.cacheManager.set(cacheKey, result, 3600 * 1000); // 1 hour TTL
    } catch (e) {
      console.error('Cache set error:', e);
    }
    return result;
  }

  async findPublic(companyId: string): Promise<CategoryEntity[]> {
    const cacheKey = `categories:company_${companyId}:public`;
    try {
      const cached = await this.cacheManager.get<CategoryEntity[]>(cacheKey);
      if (cached) return cached;
    } catch (e) {
      console.error('Cache get error:', e);
    }

    // Optimized select for public view
    const categories = await this.categoryRepository.find({
      select: {
        id: true,
        name: true,
        slug: true,
        photo: true,
        isActive: true, // Need to filter, but maybe not expose? Actually we filter by 'true'
        children: {
          id: true,
          name: true,
          slug: true,
          photo: true,
        },
      },
      where: {
        deletedAt: IsNull(),
        companyId,
        isActive: true,
        parent: IsNull(), // Only root categories, children loaded via relations
      },
      relations: ["children"],
    });

    try {
      await this.cacheManager.set(cacheKey, categories, 3600 * 1000); // 1 hour TTL
    } catch (e) {
      console.error('Cache set error:', e);
    }
    return categories;
  }


  async findOne(id: number, companyId: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id, deletedAt: IsNull(), companyId },
      relations: ["parent", "children"],
    });

    if (!category) throw new NotFoundException("Category not found");

    // ensure slug is never undefined
    category.slug = category.slug ? category.slug.toLowerCase() : this.generateSlug(category.name);

    return category;
  }


  async update(id: number, updateDto: UpdateCategoryDto, companyId: string, performedByUserId?: number): Promise<CategoryEntity> {
    const category = await this.findOne(id, companyId);
    const oldValues = { name: category.name, slug: category.slug, isActive: category.isActive };

    if (updateDto.name !== undefined) {
      category.name = updateDto.name;
      category.slug = this.generateSlug(updateDto.name);
    }

    if (updateDto.photo !== undefined) category.photo = updateDto.photo;
    if (updateDto.isActive !== undefined) category.isActive = updateDto.isActive;

    if (updateDto.parentId !== undefined) {
      if (updateDto.parentId === null) {
        category.parent = null;
      } else {
        const parent = await this.categoryRepository.findOne({
          where: { id: updateDto.parentId, companyId }
        });
        if (!parent) throw new NotFoundException("Parent category not found");
        if (parent.id === id) throw new BadRequestException("Category cannot be its own parent");
        category.parent = parent;
      }
    }

    const saved = await this.categoryRepository.save(category);
    if (performedByUserId) {
      try {
        await this.activityLogService.logActivity({
          companyId,
          action: ActivityAction.UPDATE,
          entity: ActivityEntity.CATEGORY,
          entityId: saved.id,
          entityName: saved.name,
          description: `Updated category: ${saved.name}`,
          oldValues,
          newValues: { name: saved.name, slug: saved.slug, isActive: saved.isActive },
          performedByUserId,
        });
      } catch (e) {
        console.error('Failed to log activity:', e);
      }
    }
    await this.clearCache(companyId);
    return saved;
  }

  async softDelete(id: number, companyId: string, performedByUserId?: number): Promise<void> {
    const category = await this.findOne(id, companyId);
    if (performedByUserId) {
      try {
        await this.activityLogService.logActivity({
          companyId,
          action: ActivityAction.DELETE,
          entity: ActivityEntity.CATEGORY,
          entityId: category.id,
          entityName: category.name,
          description: `Deleted category: ${category.name}`,
          performedByUserId,
        });
      } catch (e) {
        console.error('Failed to log activity:', e);
      }
    }
    await this.categoryRepository.softRemove(category); // Soft delete sets deletedAt timestamp
    await this.clearCache(companyId);
  }

  async listTrashed(companyId: string): Promise<CategoryEntity[]> {
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

  async restore(id: number, companyId: string, performedByUserId?: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id, companyId },
      withDeleted: true,
      relations: ["parent", "children"],
    });
    if (!category) throw new NotFoundException("Category not found");
    if (!category.deletedAt) return category; // already active

    await this.categoryRepository.recover(category);

    const restored = await this.findOne(id, companyId);
    if (performedByUserId) {
      try {
        await this.activityLogService.logActivity({
          companyId,
          action: ActivityAction.UPDATE,
          entity: ActivityEntity.CATEGORY,
          entityId: restored.id,
          entityName: restored.name,
          description: `Restored category: ${restored.name}`,
          performedByUserId,
        });
      } catch (e) {
        console.error('Failed to log activity:', e);
      }
    }
    await this.clearCache(companyId);
    return restored;
  }

  public async hardDeleteTrashedOlderThanDays(days: number): Promise<number> {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const repo = this.dataSource.getRepository(CategoryEntity);

    const rawIds = await repo
      .createQueryBuilder("category")
      .withDeleted()
      .select("category.id", "id")
      .where("category.deletedAt IS NOT NULL")
      .andWhere("category.deletedAt < :cutoff", { cutoff })
      .getRawMany<{ id: number }>();

    const idsToDelete = rawIds.map((r) => +r.id).filter((id) => Number.isFinite(id));

    if (idsToDelete.length === 0) return 0;

    // Ensure self-referencing FKs don't block deletion:
    // if a child references a soon-to-be-deleted parent, detach it.
    return await this.dataSource.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .update(CategoryEntity)
        .set({ parent: null })
        .where("parentId IN (:...ids)", { ids: idsToDelete })
        .execute();

      const res = await manager
        .createQueryBuilder()
        .delete()
        .from(CategoryEntity)
        .where("id IN (:...ids)", { ids: idsToDelete })
        .execute();

      return res.affected ?? 0;
    });
  }

  async toggleActive(id: number, active: boolean | undefined, companyId: string): Promise<CategoryEntity> {
    const category = await this.findOne(id, companyId);
    category.isActive = active !== undefined ? active : !category.isActive;
    const saved = await this.categoryRepository.save(category);
    await this.clearCache(companyId);
    return saved;
  }
}
