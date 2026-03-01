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
exports.CartproductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cartproduct_entity_1 = require("./entities/cartproduct.entity");
const product_entity_1 = require("../products/entities/product.entity");
const user_entity_1 = require("../users/entities/user.entity");
const orders_service_1 = require("../orders/orders.service");
const request_context_service_1 = require("../common/services/request-context.service");
let CartproductsService = class CartproductsService {
    async findUserCart(userId, companyId) {
        if (!companyId) {
            throw new common_1.BadRequestException('CompanyId is required');
        }
        return this.cartRepo.find({
            where: { user: { id: userId }, companyId },
            relations: ['product', 'user'],
            order: { updatedAt: 'DESC' },
        });
    }
    constructor(cartRepo, productRepo, userRepo, ordersService, requestContextService) {
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.ordersService = ordersService;
        this.requestContextService = requestContextService;
    }
    async create(dto, companyId) {
        if (!companyId) {
            throw new common_1.BadRequestException('CompanyId is required');
        }
        const user = await this.userRepo.findOne({ where: { id: dto.userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const product = await this.productRepo.findOne({
            where: {
                id: dto.productId,
                companyId,
                deletedAt: (0, typeorm_2.IsNull)()
            }
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const existing = await this.cartRepo.findOne({
            where: { user: { id: user.id }, product: { id: product.id }, companyId },
            relations: ['user', 'product'],
            withDeleted: true,
        });
        const finalPrice = product.discountPrice || product.price;
        if (existing) {
            if (existing.deletedAt) {
                await this.cartRepo.restore(existing.id);
                const restored = await this.cartRepo.findOne({
                    where: { id: existing.id },
                    relations: ['user', 'product'],
                });
                if (restored) {
                    restored.quantity += dto.quantity;
                    restored.unitPrice = +finalPrice;
                    restored.totalPrice = +restored.unitPrice * restored.quantity;
                    restored.companyId = companyId;
                    return this.cartRepo.save(restored);
                }
            }
            existing.quantity += dto.quantity;
            existing.unitPrice = +finalPrice;
            existing.totalPrice = +existing.unitPrice * existing.quantity;
            existing.companyId = companyId;
            return this.cartRepo.save(existing);
        }
        const item = this.cartRepo.create({
            user,
            product,
            quantity: dto.quantity,
            unitPrice: +finalPrice,
            totalPrice: +finalPrice * dto.quantity,
            companyId,
        });
        return this.cartRepo.save(item);
    }
    async findAll(userId, companyId) {
        const where = {};
        if (userId)
            where.user = { id: userId };
        if (companyId)
            where.companyId = companyId;
        return this.cartRepo.find({
            where,
            relations: ['product', 'user'],
            order: { updatedAt: 'DESC' },
        });
    }
    async findOne(id) {
        const item = await this.cartRepo.findOne({
            where: { id },
            relations: ['product', 'user'],
        });
        if (!item)
            throw new common_1.NotFoundException('Cart item not found');
        return item;
    }
    async update(id, dto) {
        const item = await this.findOne(id);
        if (dto.quantity !== undefined) {
            if (dto.quantity < 1)
                throw new common_1.BadRequestException('Quantity must be at least 1');
            item.quantity = dto.quantity;
        }
        item.totalPrice = +item.unitPrice * item.quantity;
        return this.cartRepo.save(item);
    }
    async remove(id) {
        const res = await this.cartRepo.softDelete(id);
        if (!res.affected)
            throw new common_1.NotFoundException('Cart item not found');
    }
    async clearUserCart(userId, companyId) {
        if (!companyId) {
            throw new common_1.BadRequestException('CompanyId is required');
        }
        const items = await this.cartRepo.find({
            where: { user: { id: userId }, companyId },
        });
        if (!items.length) {
            throw new common_1.NotFoundException('No cart items found for user');
        }
        await this.cartRepo.softDelete(items.map((i) => i.id));
        return { affected: items.length };
    }
    async orderFromUserCart(userId, payload) {
        const items = await this.cartRepo.find({
            where: { user: { id: userId } },
            relations: ['product', 'user'],
        });
        if (!items.length)
            throw new common_1.BadRequestException('Cart is empty');
        const companyId = this.requestContextService.getCompanyId();
        const orderDto = {
            customerId: userId,
            items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
            paymentMethod: payload?.paymentMethod,
            pickupPoint: payload?.pickupPoint,
        };
        const order = await this.ordersService.create(orderDto, companyId);
        await this.cartRepo.softDelete(items.map((i) => i.id));
        return order;
    }
};
exports.CartproductsService = CartproductsService;
exports.CartproductsService = CartproductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cartproduct_entity_1.Cartproduct)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        orders_service_1.OrderService,
        request_context_service_1.RequestContextService])
], CartproductsService);
//# sourceMappingURL=cartproducts.service.js.map