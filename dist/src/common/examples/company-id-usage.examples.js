"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = exports.QueryBuilderService = exports.RelatedEntityService = exports.ExampleService = exports.ExampleController = void 0;
class ExampleEntity {
}
class CategoryEntity {
}
class ProductEntity {
}
class OrderEntity {
}
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const company_id_guard_1 = require("../guards/company-id.guard");
const company_id_decorator_1 = require("../decorators/company-id.decorator");
let ExampleController = class ExampleController {
    constructor(service) {
        this.service = service;
    }
    async findAll(companyId) {
        return this.service.findAll(companyId);
    }
    async create(dto, companyId) {
        return this.service.create(dto, companyId);
    }
    async findOne(id, companyId) {
        return this.service.findOne(id, companyId);
    }
};
exports.ExampleController = ExampleController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExampleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ExampleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ExampleController.prototype, "findOne", null);
exports.ExampleController = ExampleController = __decorate([
    (0, common_1.Controller)('example'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    __metadata("design:paramtypes", [ExampleService])
], ExampleController);
const common_2 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let ExampleService = class ExampleService {
    constructor(repo) {
        this.repo = repo;
    }
    async create(dto, companyId) {
        const entity = this.repo.create({
            ...dto,
            companyId,
        });
        return this.repo.save(entity);
    }
    async findAll(companyId) {
        return this.repo.find({
            where: { companyId },
            order: { id: 'DESC' },
        });
    }
    async findOne(id, companyId) {
        const entity = await this.repo.findOne({
            where: { id, companyId },
        });
        if (!entity) {
            throw new common_2.NotFoundException('Entity not found');
        }
        return entity;
    }
    async update(id, dto, companyId) {
        const entity = await this.findOne(id, companyId);
        Object.assign(entity, dto);
        return this.repo.save(entity);
    }
    async remove(id, companyId) {
        const entity = await this.findOne(id, companyId);
        await this.repo.softRemove(entity);
    }
};
exports.ExampleService = ExampleService;
exports.ExampleService = ExampleService = __decorate([
    (0, common_2.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ExampleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExampleService);
let RelatedEntityService = class RelatedEntityService {
    constructor(productRepo, categoryRepo) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
    }
    async createProductWithCategory(dto, companyId) {
        const category = await this.categoryRepo.findOne({
            where: { id: dto.categoryId, companyId },
        });
        if (!category) {
            throw new common_2.NotFoundException('Category not found');
        }
        const product = this.productRepo.create({
            ...dto,
            category,
            companyId,
        });
        return this.productRepo.save(product);
    }
    async findProductsByCategory(categoryId, companyId) {
        const category = await this.categoryRepo.findOne({
            where: { id: categoryId, companyId },
        });
        if (!category) {
            throw new common_2.NotFoundException('Category not found');
        }
        return this.productRepo.find({
            where: { category: { id: categoryId }, companyId },
        });
    }
};
exports.RelatedEntityService = RelatedEntityService;
exports.RelatedEntityService = RelatedEntityService = __decorate([
    (0, common_2.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ProductEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(CategoryEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RelatedEntityService);
let QueryBuilderService = class QueryBuilderService {
    constructor(orderRepo) {
        this.orderRepo = orderRepo;
    }
    async findOrdersWithFilters(companyId, filters) {
        const qb = this.orderRepo
            .createQueryBuilder('order')
            .where('order.companyId = :companyId', { companyId });
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
    async getOrderStats(companyId) {
        return this.orderRepo
            .createQueryBuilder('order')
            .where('order.companyId = :companyId', { companyId })
            .select('COUNT(order.id)', 'totalOrders')
            .addSelect('SUM(order.totalAmount)', 'totalRevenue')
            .addSelect('AVG(order.totalAmount)', 'averageOrderValue')
            .getRawOne();
    }
};
exports.QueryBuilderService = QueryBuilderService;
exports.QueryBuilderService = QueryBuilderService = __decorate([
    (0, common_2.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(OrderEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], QueryBuilderService);
const typeorm_3 = require("typeorm");
let TransactionService = class TransactionService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createOrderWithItems(dto, companyId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const item of dto.items) {
                const product = await queryRunner.manager.findOne(ProductEntity, {
                    where: { id: item.productId, companyId },
                });
                if (!product) {
                    throw new common_2.NotFoundException(`Product ${item.productId} not found`);
                }
            }
            const order = new OrderEntity();
            order.companyId = companyId;
            order.items = dto.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: 0,
                totalPrice: 0,
            }));
            const savedOrder = await queryRunner.manager.save(order);
            await queryRunner.commitTransaction();
            return savedOrder;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_2.Injectable)(),
    __metadata("design:paramtypes", [typeorm_3.DataSource])
], TransactionService);
//# sourceMappingURL=company-id-usage.examples.js.map