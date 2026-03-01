import { HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { PublicCategoryDto } from './dto/category-response.dto';
export declare class PublicCategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    findAll(companyId: string): Promise<{
        statusCode: HttpStatus;
        data: PublicCategoryDto[];
    }>;
}
