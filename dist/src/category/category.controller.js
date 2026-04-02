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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const category_service_1 = require("./category.service");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
const company_id_decorator_1 = require("../common/decorators/company-id.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const company_id_guard_1 = require("../common/guards/company-id.guard");
const dashboard_service_1 = require("../dashboard/dashboard.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
const system_user_role_enum_1 = require("../systemuser/system-user-role.enum");
let CategoryController = class CategoryController {
    constructor(categoryService, dashboardService) {
        this.categoryService = categoryService;
        this.dashboardService = dashboardService;
    }
    async create(createDto, companyIdFromQuery, companyIdFromToken, req) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId)
            throw new common_1.BadRequestException("companyId is required");
        const role = req?.user?.role;
        const numericUserId = +(req?.user?.userId || req?.user?.sub);
        const performedByUserId = role && [system_user_role_enum_1.SystemUserRole.SUPER_ADMIN, system_user_role_enum_1.SystemUserRole.SYSTEM_OWNER, system_user_role_enum_1.SystemUserRole.EMPLOYEE].includes(role)
            ? numericUserId
            : undefined;
        const resellerId = role === system_user_role_enum_1.SystemUserRole.RESELLER ? numericUserId : undefined;
        const category = await this.categoryService.create(createDto, companyId, performedByUserId, resellerId);
        return { statusCode: common_1.HttpStatus.CREATED, message: "Category created", data: category };
    }
    async findAll(companyIdFromQuery, companyIdFromToken, resellerIdFromQuery, req) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        const role = req?.user?.role;
        const numericUserId = +(req?.user?.userId || req?.user?.sub);
        const resellerId = resellerIdFromQuery ? +resellerIdFromQuery : undefined;
        const categories = await this.categoryService.findAll(companyId, resellerId);
        return { statusCode: common_1.HttpStatus.OK, data: categories };
    }
    async listTrash(companyIdFromQuery, companyIdFromToken) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId)
            throw new common_1.BadRequestException("companyId is required");
        const categories = await this.categoryService.listTrashed(companyId);
        return { statusCode: common_1.HttpStatus.OK, data: categories };
    }
    async getCategoryStats(companyId) {
        const data = await this.dashboardService.getCategoryStats(companyId);
        return {
            statusCode: 200,
            message: 'Category stats retrieved successfully',
            data,
        };
    }
    async findPublic(companyId) {
        if (!companyId)
            throw new common_1.BadRequestException("companyId is required");
        const categories = await this.categoryService.findPublic(companyId);
        return { statusCode: common_1.HttpStatus.OK, data: categories };
    }
    async findOne(id, companyId) {
        const category = await this.categoryService.findOne(id, companyId);
        return { statusCode: common_1.HttpStatus.OK, data: category };
    }
    async restore(id, companyIdFromQuery, companyIdFromToken, req) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId)
            throw new common_1.BadRequestException("companyId is required");
        const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
            ? +(req.user.userId || req.user.sub) : undefined;
        const category = await this.categoryService.restore(id, companyId, performedByUserId);
        return { statusCode: common_1.HttpStatus.OK, message: "Category restored", data: category };
    }
    async update(id, updateDto, companyIdFromQuery, companyIdFromToken, req) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
            ? +(req.user.userId || req.user.sub) : undefined;
        const category = await this.categoryService.update(id, updateDto, companyId, performedByUserId);
        return { statusCode: common_1.HttpStatus.OK, message: "Category updated", data: category };
    }
    async softDelete(id, companyId, req) {
        const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
            ? +(req.user.userId || req.user.sub) : undefined;
        await this.categoryService.softDelete(id, companyId, performedByUserId);
        return { statusCode: common_1.HttpStatus.OK, message: "Category moved to trash" };
    }
    async toggleActive(id, active, companyId) {
        const activeBool = active !== undefined
            ? ["true", "1"].includes(active.toLowerCase())
            : undefined;
        const category = await this.categoryService.toggleActive(id, activeBool, companyId);
        const state = category.isActive ? "activated" : "disabled";
        return { statusCode: common_1.HttpStatus.OK, message: `Category ${state}`, data: category };
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)("companyId")),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto, String, String, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("companyId")),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Query)("resellerId")),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("trash"),
    __param(0, (0, common_1.Query)("companyId")),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "listTrash", null);
__decorate([
    (0, common_1.Get)("stats"),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategoryStats", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)("public"),
    __param(0, (0, common_1.Query)("companyId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findPublic", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id/restore"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("companyId")),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "restore", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)("companyId")),
    __param(3, (0, company_id_decorator_1.CompanyId)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_category_dto_1.UpdateCategoryDto, String, String, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Patch)(":id/toggle-active"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("active")),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "toggleActive", null);
exports.CategoryController = CategoryController = __decorate([
    (0, common_1.Controller)("categories"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    __metadata("design:paramtypes", [category_service_1.CategoryService,
        dashboard_service_1.DashboardService])
], CategoryController);
//# sourceMappingURL=category.controller.js.map