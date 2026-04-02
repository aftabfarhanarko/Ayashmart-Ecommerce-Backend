import { Repository } from "typeorm";
import { ProductEntity } from "./entities/product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { CategoryEntity } from "../category/entities/category.entity";
import { Order } from "../orders/entities/order.entity";
import { ActivityLogService } from "../systemuser/activity-log.service";
import { NotificationsService } from "../notifications/notifications.service";
import { Cache } from "cache-manager";
export declare class ProductService {
    private productRepository;
    private categoryRepository;
    private orderRepository;
    private readonly activityLogService;
    private readonly notificationsService;
    private cacheManager;
    constructor(productRepository: Repository<ProductEntity>, categoryRepository: Repository<CategoryEntity>, orderRepository: Repository<Order>, activityLogService: ActivityLogService, notificationsService: NotificationsService, cacheManager: Cache);
    private clearCache;
    create(createDto: CreateProductDto, companyId: string, performedByUserId?: number, resellerId?: number): Promise<ProductEntity>;
    findAll(companyId: string, options?: {
        relations?: string[];
        status?: 'draft' | 'published' | 'trashed';
        resellerId?: number;
    }): Promise<ProductEntity[]>;
    findPublic(companyId: string, options?: {
        categorySlug?: string;
        limit?: number;
        offset?: number;
        search?: string;
    }): Promise<ProductEntity[]>;
    findPublicByCategory(companyId: string, categoryName?: string | undefined, categoryId?: number | undefined, options?: {
        limit?: number;
        offset?: number;
    }): Promise<ProductEntity[]>;
    findPublicOne(companyId: string, identifier: string | number): Promise<ProductEntity>;
    findByCategory(companyId: string, categoryName?: string, categoryId?: number, options?: {
        relations?: string[];
    }): Promise<ProductEntity[]>;
    findOne(id: number, companyId: string, options?: {
        relations?: string[];
        includeTrashed?: boolean;
    }): Promise<ProductEntity>;
    update(id: number, updateDto: UpdateProductDto, companyId: string, performedByUserId?: number): Promise<ProductEntity>;
    softDelete(id: number, companyId: string, performedByUserId?: number): Promise<void>;
    getTrashedProducts(companyId: string, resellerId?: number): Promise<ProductEntity[]>;
    getDraftProducts(companyId: string, resellerId?: number): Promise<ProductEntity[]>;
    recoverFromTrash(id: number, companyId: string): Promise<ProductEntity>;
    permanentDelete(id: number, companyId: string, performedByUserId?: number): Promise<void>;
    autoDeleteOldTrash(): Promise<number>;
    publishDraft(id: number, companyId: string): Promise<ProductEntity>;
    rejectProduct(id: number, companyId: string, reason?: string): Promise<ProductEntity>;
    getPendingApprovalProducts(companyId: string): Promise<any[]>;
    toggleActive(id: number, active: boolean, companyId: string): Promise<ProductEntity>;
    findTrending(companyId: string, days?: number, limit?: number): Promise<ProductEntity[]>;
    setFlashSell(productIds: number[], flashSellStartTime: Date, flashSellEndTime: Date, flashSellPrice: number | undefined, companyId: string): Promise<ProductEntity[]>;
    removeFlashSell(productIds: number[], companyId: string): Promise<ProductEntity[]>;
    getActiveFlashSellProducts(companyId: string): Promise<ProductEntity[]>;
    getStockHistory(productId: number, companyId: string, limit?: number): Promise<Array<{
        id: number;
        createdAt: Date;
        type: 'IN' | 'OUT';
        quantity: number;
        previousStock: number | null;
        newStock: number | null;
        user?: {
            id: number;
            name: string;
            email: string;
        };
        reason?: string | null;
    }>>;
    bulkCreate(products: Array<{
        name: string;
        sku: string;
        price: number;
        discountPrice?: number;
        categoryId: number;
        isActive?: boolean;
        description?: string;
        thumbnail?: string;
        images?: string;
        stock?: number;
    }>, companyId: string): Promise<{
        success: ProductEntity[];
        failed: Array<{
            row: number;
            data: any;
            error: string;
        }>;
    }>;
}
