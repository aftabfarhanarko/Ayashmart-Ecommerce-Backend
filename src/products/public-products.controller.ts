import {
    BadRequestException,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Param,
    Query,
    SerializeOptions,
    UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { PublicProductDto } from './dto/product-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('public/products')
@UseInterceptors(ClassSerializerInterceptor)
export class PublicProductController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    async findAll(
        @Query('companyId') companyId: string,
        @Query('categorySlug') categorySlug?: string,
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
        @Query('search') search?: string,
    ) {
        if (!companyId) {
            throw new BadRequestException('companyId is required');
        }

        const products = await this.productService.findPublic(companyId, {
            categorySlug,
            limit: limit ? parseInt(limit, 10) : 20,
            offset: offset ? parseInt(offset, 10) : 0,
            search,
        });

        // Manually transform to DTO to ensure only exposed fields are returned
        // Although ClassSerializerInterceptor handles it if we return Class instances, 
        // findPublic returns Entities. Mapping to DTO explicitly is safer for "Only required data" rule.
        const data = plainToInstance(PublicProductDto, products, {
            excludeExtraneousValues: true,
        });

        return { statusCode: HttpStatus.OK, data };
    }

    @Get(':identifier')
    async findOne(
        @Param('identifier') identifier: string,
        @Query('companyId') companyId: string,
    ) {
        if (!companyId) {
            throw new BadRequestException('companyId is required');
        }

        const product = await this.productService.findPublicOne(companyId, identifier);

        const data = plainToInstance(PublicProductDto, product, {
            excludeExtraneousValues: true,
        });

        return { statusCode: HttpStatus.OK, data };
    }
}
