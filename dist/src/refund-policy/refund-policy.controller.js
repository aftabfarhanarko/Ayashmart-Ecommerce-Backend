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
exports.RefundPolicyController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../common/decorators/public.decorator");
const refund_policy_service_1 = require("./refund-policy.service");
const create_refund_policy_dto_1 = require("./dto/create-refund-policy.dto");
const update_refund_policy_dto_1 = require("./dto/update-refund-policy.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const company_id_guard_1 = require("../common/guards/company-id.guard");
const company_id_decorator_1 = require("../common/decorators/company-id.decorator");
let RefundPolicyController = class RefundPolicyController {
    constructor(refundPolicyService) {
        this.refundPolicyService = refundPolicyService;
    }
    async create(createRefundPolicyDto, companyId) {
        const data = await this.refundPolicyService.create(createRefundPolicyDto, companyId);
        return { status: 'success', message: 'Refund Policy created successfully', data };
    }
    async findAll(companyId) {
        const data = await this.refundPolicyService.findAll(companyId);
        return { status: 'success', message: 'Refund Policies fetched successfully', data };
    }
    async findAllPublic(companyId) {
        const data = await this.refundPolicyService.findAll(companyId);
        return { status: 'success', message: 'Refund Policies fetched successfully', data };
    }
    async findOnePublic(id, companyId) {
        const data = await this.refundPolicyService.findOne(id, companyId);
        return { status: 'success', message: 'Refund Policy fetched successfully', data };
    }
    async findOne(id, companyId) {
        const data = await this.refundPolicyService.findOne(id, companyId);
        return { status: 'success', message: 'Refund Policy fetched successfully', data };
    }
    async update(id, updateRefundPolicyDto, companyId) {
        const data = await this.refundPolicyService.update(id, updateRefundPolicyDto, companyId);
        return { status: 'success', message: 'Refund Policy updated successfully', data };
    }
    async remove(id, companyId) {
        await this.refundPolicyService.remove(id, companyId);
        return { status: 'success', message: 'Refund Policy removed successfully' };
    }
};
exports.RefundPolicyController = RefundPolicyController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_refund_policy_dto_1.CreateRefundPolicyDto, String]),
    __metadata("design:returntype", Promise)
], RefundPolicyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RefundPolicyController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RefundPolicyController.prototype, "findAllPublic", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('public/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], RefundPolicyController.prototype, "findOnePublic", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], RefundPolicyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_refund_policy_dto_1.UpdateRefundPolicyDto, String]),
    __metadata("design:returntype", Promise)
], RefundPolicyController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], RefundPolicyController.prototype, "remove", null);
exports.RefundPolicyController = RefundPolicyController = __decorate([
    (0, common_1.Controller)('refund-policy'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    __metadata("design:paramtypes", [refund_policy_service_1.RefundPolicyService])
], RefundPolicyController);
//# sourceMappingURL=refund-policy.controller.js.map