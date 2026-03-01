import {
    BadRequestException,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { PublicCategoryDto } from './dto/category-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('public/categories')
@UseInterceptors(ClassSerializerInterceptor)
export class PublicCategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Get()
    async findAll(@Query('companyId') companyId: string) {
        if (!companyId) {
            throw new BadRequestException('companyId is required');
        }

        const categories = await this.categoryService.findPublic(companyId);

        // Transform to DTO to ensure strict response shape
        const data = plainToInstance(PublicCategoryDto, categories, {
            excludeExtraneousValues: true,
        });

        return { statusCode: HttpStatus.OK, data };
    }
}
