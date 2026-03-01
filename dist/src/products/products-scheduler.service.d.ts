import { OnModuleInit } from '@nestjs/common';
import { ProductService } from './products.service';
export declare class ProductsSchedulerService implements OnModuleInit {
    private readonly productService;
    private readonly logger;
    private intervalId;
    constructor(productService: ProductService);
    onModuleInit(): void;
    handleAutoDeleteOldTrash(): Promise<void>;
    onModuleDestroy(): void;
}
