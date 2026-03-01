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
exports.PromocodeController = void 0;
const common_1 = require("@nestjs/common");
const promocode_service_1 = require("./promocode.service");
const create_promocode_dto_1 = require("./dto/create-promocode.dto");
const update_promocode_dto_1 = require("./dto/update-promocode.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const company_id_guard_1 = require("../common/guards/company-id.guard");
const company_id_decorator_1 = require("../common/decorators/company-id.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
let PromocodeController = class PromocodeController {
    constructor(promocodeService) {
        this.promocodeService = promocodeService;
    }
    async findPublic(companyId) {
        if (!companyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        const promos = await this.promocodeService.findPublic(companyId);
        return { statusCode: common_1.HttpStatus.OK, data: promos };
    }
    async create(dto, companyIdFromQuery, companyIdFromToken) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        const promo = await this.promocodeService.create(dto, companyId);
        return { statusCode: common_1.HttpStatus.CREATED, message: 'Promocode created', data: promo };
    }
    async findAll(companyIdFromQuery, companyIdFromToken) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        const promos = await this.promocodeService.findAll(companyId);
        return { statusCode: common_1.HttpStatus.OK, data: promos };
    }
    async findOne(id, companyIdFromQuery, companyIdFromToken) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        const promo = await this.promocodeService.findOne(id, companyId);
        return { statusCode: common_1.HttpStatus.OK, data: promo };
    }
    async update(id, dto, companyIdFromQuery, companyIdFromToken) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        const promo = await this.promocodeService.update(id, dto, companyId);
        return { statusCode: common_1.HttpStatus.OK, message: 'Promocode updated', data: promo };
    }
    async remove(id, companyIdFromQuery, companyIdFromToken) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        await this.promocodeService.remove(id, companyId);
        return { statusCode: common_1.HttpStatus.OK, message: 'Promocode soft deleted' };
    }
    async toggleActive(id, active, companyIdFromQuery, companyIdFromToken) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        const isActive = active === 'true';
        const promo = await this.promocodeService.toggleActive(id, isActive, companyId);
        return { statusCode: common_1.HttpStatus.OK, message: `Promocode ${isActive ? 'activated' : 'disabled'}`, data: promo };
    }
};
exports.PromocodeController = PromocodeController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromocodeController.prototype, "findPublic", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_promocode_dto_1.CreatePromocodeDto, String, String]),
    __metadata("design:returntype", Promise)
], PromocodeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PromocodeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], PromocodeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('companyId')),
    __param(3, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_promocode_dto_1.UpdatePromocodeDto, String, String]),
    __metadata("design:returntype", Promise)
], PromocodeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], PromocodeController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-active'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('active')),
    __param(2, (0, common_1.Query)('companyId')),
    __param(3, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", Promise)
], PromocodeController.prototype, "toggleActive", null);
exports.PromocodeController = PromocodeController = __decorate([
    (0, common_1.Controller)('promocode'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    __metadata("design:paramtypes", [promocode_service_1.PromocodeService])
], PromocodeController);
//# sourceMappingURL=promocode.controller.js.map