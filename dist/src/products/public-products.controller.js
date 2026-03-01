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
exports.PublicProductController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const product_response_dto_1 = require("./dto/product-response.dto");
const class_transformer_1 = require("class-transformer");
let PublicProductController = class PublicProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async findAll(companyId, categorySlug, limit, offset, search) {
        if (!companyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        const products = await this.productService.findPublic(companyId, {
            categorySlug,
            limit: limit ? parseInt(limit, 10) : 20,
            offset: offset ? parseInt(offset, 10) : 0,
            search,
        });
        const data = (0, class_transformer_1.plainToInstance)(product_response_dto_1.PublicProductDto, products, {
            excludeExtraneousValues: true,
        });
        return { statusCode: common_1.HttpStatus.OK, data };
    }
    async findOne(identifier, companyId) {
        if (!companyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        const product = await this.productService.findPublicOne(companyId, identifier);
        const data = (0, class_transformer_1.plainToInstance)(product_response_dto_1.PublicProductDto, product, {
            excludeExtraneousValues: true,
        });
        return { statusCode: common_1.HttpStatus.OK, data };
    }
};
exports.PublicProductController = PublicProductController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('categorySlug')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PublicProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':identifier'),
    __param(0, (0, common_1.Param)('identifier')),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PublicProductController.prototype, "findOne", null);
exports.PublicProductController = PublicProductController = __decorate([
    (0, common_1.Controller)('public/products'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [products_service_1.ProductService])
], PublicProductController);
//# sourceMappingURL=public-products.controller.js.map