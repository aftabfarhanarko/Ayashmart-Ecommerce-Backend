import { DataSource, Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoryEntity } from "./entities/category.entity";
import { ActivityLogService } from "../systemuser/activity-log.service";
import { Cache } from "cache-manager";
export declare class CategoryService {
    private categoryRepository;
    private readonly activityLogService;
    private readonly dataSource;
    private cacheManager;
    constructor(categoryRepository: Repository<CategoryEntity>, activityLogService: ActivityLogService, dataSource: DataSource, cacheManager: Cache);
    private clearCache;
    private generateSlug;
    create(createDto: CreateCategoryDto, companyId: string, performedByUserId?: number, resellerId?: number): Promise<CategoryEntity>;
    findAll(companyId: string, resellerId?: number): Promise<CategoryEntity[]>;
    findPublic(companyId: string): Promise<CategoryEntity[]>;
    findOne(id: number, companyId: string): Promise<CategoryEntity>;
    update(id: number, updateDto: UpdateCategoryDto, companyId: string, performedByUserId?: number): Promise<CategoryEntity>;
    softDelete(id: number, companyId: string, performedByUserId?: number): Promise<void>;
    listTrashed(companyId: string): Promise<CategoryEntity[]>;
    restore(id: number, companyId: string, performedByUserId?: number): Promise<CategoryEntity>;
    hardDeleteTrashedOlderThanDays(days: number): Promise<number>;
    toggleActive(id: number, active: boolean | undefined, companyId: string): Promise<CategoryEntity>;
}
