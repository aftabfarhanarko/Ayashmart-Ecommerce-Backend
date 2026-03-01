import { HttpStatus } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { DashboardService } from '../dashboard/dashboard.service';
export declare class CategoryController {
    private readonly categoryService;
    private readonly dashboardService;
    constructor(categoryService: CategoryService, dashboardService: DashboardService);
    create(createDto: CreateCategoryDto, companyIdFromQuery?: string, companyIdFromToken?: string, req?: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/category.entity").CategoryEntity;
    }>;
    findAll(companyIdFromQuery?: string, companyIdFromToken?: string, resellerIdFromQuery?: string, req?: any): Promise<{
        statusCode: HttpStatus;
        data: import("./entities/category.entity").CategoryEntity[];
    }>;
    listTrash(companyIdFromQuery?: string, companyIdFromToken?: string): Promise<{
        statusCode: HttpStatus;
        data: import("./entities/category.entity").CategoryEntity[];
    }>;
    getCategoryStats(companyId: string): Promise<{
        statusCode: number;
        message: string;
        data: {
            totalCategories: number;
            activeCategories: number;
            inactiveCategories: number;
            rootCategories: number;
            productsWithCategory: number;
        };
    }>;
    findPublic(companyId: string): Promise<{
        statusCode: HttpStatus;
        data: import("./entities/category.entity").CategoryEntity[];
    }>;
    findOne(id: number, companyId: string): Promise<{
        statusCode: HttpStatus;
        data: import("./entities/category.entity").CategoryEntity;
    }>;
    restore(id: number, companyIdFromQuery?: string, companyIdFromToken?: string, req?: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/category.entity").CategoryEntity;
    }>;
    update(id: number, updateDto: UpdateCategoryDto, companyIdFromQuery?: string, companyIdFromToken?: string, req?: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/category.entity").CategoryEntity;
    }>;
    softDelete(id: number, companyId: string, req?: any): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    toggleActive(id: number, active: string | undefined, companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/category.entity").CategoryEntity;
    }>;
}
