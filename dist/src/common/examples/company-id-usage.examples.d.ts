declare class ExampleEntity {
    id: number;
    name: string;
    companyId: string;
}
declare class CategoryEntity {
    id: number;
    name: string;
    companyId: string;
}
declare class ProductEntity {
    id: number;
    name: string;
    companyId: string;
    category: CategoryEntity;
}
declare class OrderEntity {
    id: number;
    totalAmount: number;
    status: string;
    items: Array<{
        productId: number;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }>;
    companyId: string;
    createdAt: Date;
}
interface CreateDto {
    name: string;
}
interface UpdateDto {
    name?: string;
}
interface CreateProductDto {
    name: string;
    categoryId: number;
}
interface CreateOrderDto {
    items: Array<{
        productId: number;
        quantity: number;
    }>;
}
interface OrderFilters {
    status?: string;
    fromDate?: Date;
}
export declare class ExampleController {
    private readonly service;
    constructor(service: ExampleService);
    findAll(companyId: string): Promise<ExampleEntity[]>;
    create(dto: CreateDto, companyId: string): Promise<ExampleEntity>;
    findOne(id: number, companyId: string): Promise<ExampleEntity>;
}
import { Repository } from 'typeorm';
export declare class ExampleService {
    private readonly repo;
    constructor(repo: Repository<ExampleEntity>);
    create(dto: CreateDto, companyId: string): Promise<ExampleEntity>;
    findAll(companyId: string): Promise<ExampleEntity[]>;
    findOne(id: number, companyId: string): Promise<ExampleEntity>;
    update(id: number, dto: UpdateDto, companyId: string): Promise<ExampleEntity>;
    remove(id: number, companyId: string): Promise<void>;
}
export declare class RelatedEntityService {
    private readonly productRepo;
    private readonly categoryRepo;
    constructor(productRepo: Repository<ProductEntity>, categoryRepo: Repository<CategoryEntity>);
    createProductWithCategory(dto: CreateProductDto, companyId: string): Promise<ProductEntity>;
    findProductsByCategory(categoryId: number, companyId: string): Promise<ProductEntity[]>;
}
export declare class QueryBuilderService {
    private readonly orderRepo;
    constructor(orderRepo: Repository<OrderEntity>);
    findOrdersWithFilters(companyId: string, filters: OrderFilters): Promise<OrderEntity[]>;
    getOrderStats(companyId: string): Promise<any>;
}
import { DataSource } from 'typeorm';
export declare class TransactionService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createOrderWithItems(dto: CreateOrderDto, companyId: string): Promise<OrderEntity>;
}
export {};
