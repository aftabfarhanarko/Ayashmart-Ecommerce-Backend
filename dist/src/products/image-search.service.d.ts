import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ConfigService } from '@nestjs/config';
export interface ImageSearchResult {
    match40: Array<{
        product: ProductEntity;
        matchScore: number;
    }>;
    match60: Array<{
        product: ProductEntity;
        matchScore: number;
    }>;
    imageLabels: string[];
}
export declare class ImageSearchService {
    private readonly productRepository;
    private readonly configService;
    private visionClient;
    constructor(productRepository: Repository<ProductEntity>, configService: ConfigService);
    private initVisionClient;
    private extractLabelsFromImage;
    private computeSimilarity;
    searchByImage(imageBuffer: Buffer, companyId: string, filename?: string): Promise<ImageSearchResult>;
}
