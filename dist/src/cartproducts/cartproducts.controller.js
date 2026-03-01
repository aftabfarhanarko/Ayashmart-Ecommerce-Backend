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
exports.CartproductsController = void 0;
const common_1 = require("@nestjs/common");
const cartproducts_service_1 = require("./cartproducts.service");
const create_cartproduct_dto_1 = require("./dto/create-cartproduct.dto");
const update_cartproduct_dto_1 = require("./dto/update-cartproduct.dto");
const company_id_decorator_1 = require("../common/decorators/company-id.decorator");
const company_id_guard_1 = require("../common/guards/company-id.guard");
const public_decorator_1 = require("../common/decorators/public.decorator");
let CartproductsController = class CartproductsController {
    constructor(cartproductsService) {
        this.cartproductsService = cartproductsService;
    }
    async create(createCartproductDto, companyId, companyIdFromToken) {
        const effectiveCompanyId = companyId || companyIdFromToken || createCartproductDto.companyId;
        if (!effectiveCompanyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        const data = await this.cartproductsService.create({ ...createCartproductDto, companyId: effectiveCompanyId }, effectiveCompanyId);
        return { statusCode: common_1.HttpStatus.CREATED, message: 'Added to cart', data };
    }
    async findByUser(userId, companyId, companyIdFromToken) {
        const effectiveCompanyId = companyId || companyIdFromToken;
        if (!effectiveCompanyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        const data = await this.cartproductsService.findUserCart(userId, effectiveCompanyId);
        return { statusCode: common_1.HttpStatus.OK, data };
    }
    async clearUserCart(userId, companyId, companyIdFromToken) {
        const effectiveCompanyId = companyId || companyIdFromToken;
        if (!effectiveCompanyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        const data = await this.cartproductsService.clearUserCart(userId, effectiveCompanyId);
        return { statusCode: common_1.HttpStatus.OK, message: 'User cart cleared', data };
    }
    async removeOne(id) {
        await this.cartproductsService.remove(id);
        return { statusCode: common_1.HttpStatus.OK, message: 'Cart item removed' };
    }
    async updateOne(id, dto, companyId, companyIdFromToken) {
        const effectiveCompanyId = companyId || companyIdFromToken;
        if (!effectiveCompanyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        const item = await this.cartproductsService.findOne(id);
        if (item?.companyId !== effectiveCompanyId) {
            throw new common_1.BadRequestException('Invalid companyId for cart item');
        }
        const updated = await this.cartproductsService.update(id, dto);
        return { statusCode: common_1.HttpStatus.OK, message: 'Cart item updated', data: updated };
    }
    async orderFromCart(userId, payload) {
        const data = await this.cartproductsService.orderFromUserCart(userId, payload);
        return { statusCode: common_1.HttpStatus.CREATED, message: 'Order created from cart', data };
    }
};
exports.CartproductsController = CartproductsController;
__decorate([
    (0, common_1.Post)(),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cartproduct_dto_1.CreateCartproductDto, String, String]),
    __metadata("design:returntype", Promise)
], CartproductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], CartproductsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Delete)('user/:userId'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], CartproductsController.prototype, "clearUserCart", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CartproductsController.prototype, "removeOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('companyId')),
    __param(3, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_cartproduct_dto_1.UpdateCartproductDto, String, String]),
    __metadata("design:returntype", Promise)
], CartproductsController.prototype, "updateOne", null);
__decorate([
    (0, common_1.Post)(':userId/order'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CartproductsController.prototype, "orderFromCart", null);
exports.CartproductsController = CartproductsController = __decorate([
    (0, common_1.Controller)('cartproducts'),
    (0, common_1.UseGuards)(company_id_guard_1.CompanyIdGuard),
    __metadata("design:paramtypes", [cartproducts_service_1.CartproductsService])
], CartproductsController);
//# sourceMappingURL=cartproducts.controller.js.map