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
exports.TopProductsController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../common/decorators/public.decorator");
const company_id_decorator_1 = require("../common/decorators/company-id.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const company_id_guard_1 = require("../common/guards/company-id.guard");
const top_products_service_1 = require("./top-products.service");
const update_top_products_section_dto_1 = require("./dto/update-top-products-section.dto");
const create_top_products_item_dto_1 = require("./dto/create-top-products-item.dto");
const update_top_products_item_dto_1 = require("./dto/update-top-products-item.dto");
let TopProductsController = class TopProductsController {
    constructor(topProductsService) {
        this.topProductsService = topProductsService;
    }
    async getAdminTopProducts(companyId) {
        const data = await this.topProductsService.getTopProductsAdmin(companyId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Top products section fetched successfully',
            data,
        };
    }
    async updateSection(companyId, dto) {
        const section = await this.topProductsService.updateSection(companyId, dto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Top products section updated successfully',
            data: section,
        };
    }
    async createItem(companyId, dto) {
        const item = await this.topProductsService.createItem(companyId, dto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Top product item created successfully',
            data: item,
        };
    }
    async updateItem(companyId, id, dto) {
        const item = await this.topProductsService.updateItem(companyId, id, dto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Top product item updated successfully',
            data: item,
        };
    }
    async removeItem(companyId, id) {
        await this.topProductsService.removeItem(companyId, id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Top product item deleted successfully',
        };
    }
    async getPublicTopProducts(companyId) {
        if (!companyId)
            throw new common_1.BadRequestException('companyId is required');
        const data = await this.topProductsService.getTopProductsPublic(companyId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Top products section fetched successfully',
            data,
        };
    }
};
exports.TopProductsController = TopProductsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TopProductsController.prototype, "getAdminTopProducts", null);
__decorate([
    (0, common_1.Patch)('section'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_top_products_section_dto_1.UpdateTopProductsSectionDto]),
    __metadata("design:returntype", Promise)
], TopProductsController.prototype, "updateSection", null);
__decorate([
    (0, common_1.Post)('items'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_top_products_item_dto_1.CreateTopProductsItemDto]),
    __metadata("design:returntype", Promise)
], TopProductsController.prototype, "createItem", null);
__decorate([
    (0, common_1.Patch)('items/:id'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, update_top_products_item_dto_1.UpdateTopProductsItemDto]),
    __metadata("design:returntype", Promise)
], TopProductsController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)('items/:id'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], TopProductsController.prototype, "removeItem", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TopProductsController.prototype, "getPublicTopProducts", null);
exports.TopProductsController = TopProductsController = __decorate([
    (0, common_1.Controller)('top-products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    __metadata("design:paramtypes", [top_products_service_1.TopProductsService])
], TopProductsController);
//# sourceMappingURL=top-products.controller.js.map