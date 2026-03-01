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
exports.PublicCategoryController = void 0;
const common_1 = require("@nestjs/common");
const category_service_1 = require("./category.service");
const category_response_dto_1 = require("./dto/category-response.dto");
const class_transformer_1 = require("class-transformer");
let PublicCategoryController = class PublicCategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async findAll(companyId) {
        if (!companyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        const categories = await this.categoryService.findPublic(companyId);
        const data = (0, class_transformer_1.plainToInstance)(category_response_dto_1.PublicCategoryDto, categories, {
            excludeExtraneousValues: true,
        });
        return { statusCode: common_1.HttpStatus.OK, data };
    }
};
exports.PublicCategoryController = PublicCategoryController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicCategoryController.prototype, "findAll", null);
exports.PublicCategoryController = PublicCategoryController = __decorate([
    (0, common_1.Controller)('public/categories'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], PublicCategoryController);
//# sourceMappingURL=public-category.controller.js.map