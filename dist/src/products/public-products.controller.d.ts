import { HttpStatus } from '@nestjs/common';
import { ProductService } from './products.service';
import { PublicProductDto } from './dto/product-response.dto';
export declare class PublicProductController {
    private readonly productService;
    constructor(productService: ProductService);
    findAll(companyId: string, categorySlug?: string, limit?: string, offset?: string, search?: string): Promise<{
        statusCode: HttpStatus;
        data: PublicProductDto[];
    }>;
    findOne(identifier: string, companyId: string): Promise<{
        statusCode: HttpStatus;
        data: PublicProductDto;
    }>;
}
