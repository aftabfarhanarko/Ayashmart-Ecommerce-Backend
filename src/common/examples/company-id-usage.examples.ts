/**
 * Example usage patterns for companyId in services and controllers
 * 
 * This file demonstrates best practices for implementing multi-tenant
 * functionality using companyId filtering.
 */

// ============================================
// TYPE DEFINITIONS (must be declared first)
// ============================================

// Entity classes must be declared before they are used
class ExampleEntity {
    id: number;
    name: string;
    companyId: string;
}

class CategoryEntity {
    id: number;
    name: string;
    companyId: string;
}

class ProductEntity {
    id: number;
    name: string;
    companyId: string;
    category: CategoryEntity;
}

class OrderEntity {
    id: number;
    totalAmount: number;
    status: string;
    items: Array<{ productId: number; quantity: number; unitPrice: number; totalPrice: number }>;
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
    items: Array<{ productId: number; quantity: number }>;
}

interface OrderFilters {
    status?: string;
    fromDate?: Date;
}

// ============================================
// CONTROLLER EXAMPLES
// ============================================

/**
 * Example 1: Basic Controller with CompanyId
 */
import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CompanyIdGuard } from '../guards/company-id.guard';
import { CompanyId } from '../decorators/company-id.decorator';

@Controller('example')
@UseGuards(JwtAuthGuard, CompanyIdGuard) // Apply guards at controller level
export class ExampleController {
    constructor(private readonly service: ExampleService) { }

    // GET /example
    @Get()
    async findAll(@CompanyId() companyId: string) {
        // companyId is automatically extracted from JWT
        return this.service.findAll(companyId);
    }

    // POST /example
    @Post()
    async create(@Body() dto: CreateDto, @CompanyId() companyId: string) {
        return this.service.create(dto, companyId);
    }

    // GET /example/:id
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @CompanyId() companyId: string) {
        return this.service.findOne(id, companyId);
    }
}

// ============================================
// SERVICE EXAMPLES
// ============================================

/**
 * Example 2: Service with CompanyId Filtering
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExampleService {
    constructor(
        @InjectRepository(ExampleEntity)
        private readonly repo: Repository<ExampleEntity>,
    ) { }

    // CREATE: Always set companyId
    async create(dto: CreateDto, companyId: string): Promise<ExampleEntity> {
        const entity = this.repo.create({
            ...dto,
            companyId, // Always include companyId
        });
        return this.repo.save(entity);
    }

    // FIND ALL: Always filter by companyId
    async findAll(companyId: string): Promise<ExampleEntity[]> {
        return this.repo.find({
            where: { companyId }, // Filter by companyId
            order: { id: 'DESC' },
        });
    }

    // FIND ONE: Always filter by companyId
    async findOne(id: number, companyId: string): Promise<ExampleEntity> {
        const entity = await this.repo.findOne({
            where: { id, companyId }, // Filter by companyId
        });
        if (!entity) {
            throw new NotFoundException('Entity not found');
        }
        return entity;
    }

    // UPDATE: Use findOne which already filters by companyId
    async update(id: number, dto: UpdateDto, companyId: string): Promise<ExampleEntity> {
        const entity = await this.findOne(id, companyId); // Already filters by companyId
        // Update logic here
        Object.assign(entity, dto);
        return this.repo.save(entity);
    }

    // DELETE: Use findOne which already filters by companyId
    async remove(id: number, companyId: string): Promise<void> {
        const entity = await this.findOne(id, companyId); // Already filters by companyId
        await this.repo.softRemove(entity);
    }
}

// ============================================
// RELATED ENTITY QUERIES
// ============================================

/**
 * Example 3: Querying Related Entities with CompanyId
 */
@Injectable()
export class RelatedEntityService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>,
        @InjectRepository(CategoryEntity)
        private readonly categoryRepo: Repository<CategoryEntity>,
    ) { }

    async createProductWithCategory(dto: CreateProductDto, companyId: string) {
        // Always filter related entities by companyId
        const category = await this.categoryRepo.findOne({
            where: { id: dto.categoryId, companyId }, // Filter by companyId
        });
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        const product = this.productRepo.create({
            ...dto,
            category,
            companyId, // Set companyId
        });

        return this.productRepo.save(product);
    }

    async findProductsByCategory(categoryId: number, companyId: string) {
        // Verify category belongs to company
        const category = await this.categoryRepo.findOne({
            where: { id: categoryId, companyId },
        });
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        // Find products with same companyId
        return this.productRepo.find({
            where: { category: { id: categoryId }, companyId },
        });
    }
}

// ============================================
// QUERY BUILDER EXAMPLES
// ============================================

/**
 * Example 4: Using Query Builder with CompanyId
 */
@Injectable()
export class QueryBuilderService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepo: Repository<OrderEntity>,
    ) { }

    async findOrdersWithFilters(companyId: string, filters: OrderFilters) {
        const qb = this.orderRepo
            .createQueryBuilder('order')
            .where('order.companyId = :companyId', { companyId }); // Always filter by companyId first

        if (filters.status) {
            qb.andWhere('order.status = :status', { status: filters.status });
        }

        if (filters.fromDate) {
            qb.andWhere('order.createdAt >= :fromDate', { fromDate: filters.fromDate });
        }

        return qb
            .orderBy('order.createdAt', 'DESC')
            .getMany();
    }

    async getOrderStats(companyId: string) {
        return this.orderRepo
            .createQueryBuilder('order')
            .where('order.companyId = :companyId', { companyId }) // Always filter by companyId
            .select('COUNT(order.id)', 'totalOrders')
            .addSelect('SUM(order.totalAmount)', 'totalRevenue')
            .addSelect('AVG(order.totalAmount)', 'averageOrderValue')
            .getRawOne();
    }
}

// ============================================
// TRANSACTION EXAMPLES
// ============================================

/**
 * Example 5: Transactions with CompanyId
 */
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionService {
    constructor(private readonly dataSource: DataSource) { }

    async createOrderWithItems(dto: CreateOrderDto, companyId: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Verify all products belong to the same company
            for (const item of dto.items) {
                const product = await queryRunner.manager.findOne(ProductEntity, {
                    where: { id: item.productId, companyId }, // Filter by companyId
                });
                if (!product) {
                    throw new NotFoundException(`Product ${item.productId} not found`);
                }
            }

            const order = new OrderEntity();
            order.companyId = companyId; // Set companyId
            // Store items as JSON array in the order entity
            order.items = dto.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: 0, // Calculate from product
                totalPrice: 0, // Calculate from product and quantity
            }));
            // ... set other fields

            const savedOrder = await queryRunner.manager.save(order);

            await queryRunner.commitTransaction();
            return savedOrder;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}


