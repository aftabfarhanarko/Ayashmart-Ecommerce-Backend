import { HttpStatus } from '@nestjs/common';
import { TopProductsService } from './top-products.service';
import { UpdateTopProductsSectionDto } from './dto/update-top-products-section.dto';
import { CreateTopProductsItemDto } from './dto/create-top-products-item.dto';
import { UpdateTopProductsItemDto } from './dto/update-top-products-item.dto';
export declare class TopProductsController {
    private readonly topProductsService;
    constructor(topProductsService: TopProductsService);
    getAdminTopProducts(companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./top-products.service").TopProductSection;
    }>;
    updateSection(companyId: string, dto: UpdateTopProductsSectionDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/top-products-section.entity").TopProductsSectionEntity;
    }>;
    createItem(companyId: string, dto: CreateTopProductsItemDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/top-products-item.entity").TopProductsItemEntity;
    }>;
    updateItem(companyId: string, id: number, dto: UpdateTopProductsItemDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/top-products-item.entity").TopProductsItemEntity;
    }>;
    removeItem(companyId: string, id: number): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    getPublicTopProducts(companyId?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./top-products.service").TopProductSection;
    }>;
}
