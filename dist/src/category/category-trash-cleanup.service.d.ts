import { CategoryService } from './category.service';
export declare class CategoryTrashCleanupService {
    private readonly categoryService;
    private readonly logger;
    constructor(categoryService: CategoryService);
    purgeExpiredTrashedCategories(): Promise<void>;
}
