import { HttpStatus } from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FlashSellDto } from './dto/flash-sell.dto';
import { DashboardService } from '../dashboard/dashboard.service';
export declare class ProductController {
    private readonly productService;
    private readonly dashboardService;
    constructor(productService: ProductService, dashboardService: DashboardService);
    create(createDto: CreateProductDto, companyIdFromQuery?: string, companyIdFromToken?: string, req?: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/product.entity").ProductEntity;
    }>;
    findAll(companyId: string, status?: 'draft' | 'published' | 'trashed', resellerIdFromQuery?: string, req?: any): Promise<{
        statusCode: HttpStatus;
        data: import("./entities/product.entity").ProductEntity[];
    }>;
    findAllPublic(companyId: string): Promise<{
        statusCode: HttpStatus;
        data: import("./entities/product.entity").ProductEntity[];
    }>;
    findAllForAdmin(companyIdFromQuery: string, companyIdFromToken: string, status?: 'draft' | 'published' | 'trashed', resellerIdFromQuery?: string, req?: any): Promise<{
        statusCode: HttpStatus;
        data: import("./entities/product.entity").ProductEntity[];
    }>;
    getDrafts(companyId: string, resellerIdFromQuery?: string, req?: any): Promise<{
        statusCode: HttpStatus;
        data: import("./entities/product.entity").ProductEntity[];
    }>;
    getTrash(companyId: string, resellerIdFromQuery?: string, req?: any): Promise<{
        statusCode: HttpStatus;
        data: import("./entities/product.entity").ProductEntity[];
    }>;
    getStockHistory(id: number, companyIdFromQuery?: string, companyIdFromToken?: string, limit?: string): Promise<{
        statusCode: HttpStatus;
        data: {
            id: number;
            createdAt: Date;
            type: "IN" | "OUT";
            quantity: number;
            previousStock: number | null;
            newStock: number | null;
            user?: {
                id: number;
                name: string;
                email: string;
            };
            reason?: string | null;
        }[];
    }>;
    findByCategory(companyId: string, categories?: string, categoryId?: string): Promise<{
        statusCode: HttpStatus;
        data: import("./entities/product.entity").ProductEntity[];
    }>;
    findByCategoryPublic(companyId: string, categories?: string | string[], categoryId?: string, limit?: string, offset?: string): Promise<{
        statusCode: HttpStatus;
        data: import("./entities/product.entity").ProductEntity[];
    }>;
    findTrending(companyId: string, days?: string, limit?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: any[];
    } | {
        statusCode: HttpStatus;
        data: import("./entities/product.entity").ProductEntity[];
        message?: undefined;
    }>;
    findPublic(companyId: string, categorySlug?: string, limit?: string, offset?: string, search?: string): Promise<{
        statusCode: HttpStatus;
        data: import("./entities/product.entity").ProductEntity[];
    }>;
    findPublicOne(id: string, companyId: string): Promise<{
        statusCode: HttpStatus;
        data: import("./entities/product.entity").ProductEntity;
    }>;
    getProductStats(companyId: string): Promise<{
        statusCode: number;
        message: string;
        data: {
            totalProducts: number;
            publishedProducts: number;
            draftProducts: number;
            trashedProducts: number;
            activeProducts: number;
            lowStockProducts: number;
            outOfStockProducts: number;
        };
    }>;
    bulkUpload(file: Express.Multer.File, companyIdFromQuery?: string, companyIdFromToken?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            success: number;
            failed: number;
            total: number;
            details: {
                successful: {
                    id: number;
                    name: string;
                    sku: string;
                }[];
                failed: {
                    row: number;
                    data: any;
                    error: string;
                }[];
            };
        };
    }>;
    findOne(id: number, companyId: string): Promise<{
        statusCode: HttpStatus;
        data: import("./entities/product.entity").ProductEntity;
    }>;
    update(id: number, updateDto: UpdateProductDto, companyIdFromQuery?: string, companyIdFromToken?: string, req?: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/product.entity").ProductEntity;
    }>;
    setFlashSell(flashSellDto: FlashSellDto, companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/product.entity").ProductEntity[];
    }>;
    removeFlashSell(body: {
        productIds: number[];
    }, companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/product.entity").ProductEntity[];
    }>;
    softDelete(id: number, companyId: string, req?: any): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    recoverFromTrash(id: number, companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/product.entity").ProductEntity;
    }>;
    publishDraft(id: number, companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/product.entity").ProductEntity;
    }>;
    rejectProduct(id: number, companyId: string, body: {
        reason?: string;
    }): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/product.entity").ProductEntity;
    }>;
    getPendingApproval(companyId: string): Promise<{
        statusCode: HttpStatus;
        data: any[];
    }>;
    permanentDelete(id: number, companyId: string, req?: any): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    toggleActive(id: number, active: string, companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/product.entity").ProductEntity;
    }>;
    getActiveFlashSellProducts(companyIdFromQuery?: string, companyIdFromToken?: string): Promise<{
        statusCode: HttpStatus;
        data: import("./entities/product.entity").ProductEntity[];
    }>;
}
