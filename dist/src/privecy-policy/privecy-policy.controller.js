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
exports.PrivecyPolicyController = void 0;
const common_1 = require("@nestjs/common");
const privecy_policy_service_1 = require("./privecy-policy.service");
const create_privecy_policy_dto_1 = require("./dto/create-privecy-policy.dto");
const update_privecy_policy_dto_1 = require("./dto/update-privecy-policy.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const company_id_guard_1 = require("../common/guards/company-id.guard");
const company_id_decorator_1 = require("../common/decorators/company-id.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
let PrivecyPolicyController = class PrivecyPolicyController {
    constructor(privecyPolicyService) {
        this.privecyPolicyService = privecyPolicyService;
    }
    async create(createPrivecyPolicyDto, companyId) {
        const data = await this.privecyPolicyService.create(createPrivecyPolicyDto, companyId);
        return { status: 'success', message: 'Privacy Policy created successfully', data };
    }
    async findPublic(companyId) {
        const data = await this.privecyPolicyService.findPublic(companyId);
        return { status: 'success', message: 'Privacy Policies fetched successfully', data };
    }
    async findAll(companyId) {
        const data = await this.privecyPolicyService.findAll(companyId);
        return { status: 'success', message: 'Privacy Policies fetched successfully', data };
    }
    async findOne(id, companyId) {
        const data = await this.privecyPolicyService.findOne(id, companyId);
        return { status: 'success', message: 'Privacy Policy fetched successfully', data };
    }
    async update(id, updatePrivecyPolicyDto, companyId) {
        const data = await this.privecyPolicyService.update(id, updatePrivecyPolicyDto, companyId);
        return { status: 'success', message: 'Privacy Policy updated successfully', data };
    }
    async remove(id, companyId) {
        await this.privecyPolicyService.remove(id, companyId);
        return { status: 'success', message: 'Privacy Policy removed successfully' };
    }
};
exports.PrivecyPolicyController = PrivecyPolicyController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_privecy_policy_dto_1.CreatePrivecyPolicyDto, String]),
    __metadata("design:returntype", Promise)
], PrivecyPolicyController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrivecyPolicyController.prototype, "findPublic", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrivecyPolicyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PrivecyPolicyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_privecy_policy_dto_1.UpdatePrivecyPolicyDto, String]),
    __metadata("design:returntype", Promise)
], PrivecyPolicyController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PrivecyPolicyController.prototype, "remove", null);
exports.PrivecyPolicyController = PrivecyPolicyController = __decorate([
    (0, common_1.Controller)('privecy-policy'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    __metadata("design:paramtypes", [privecy_policy_service_1.PrivecyPolicyService])
], PrivecyPolicyController);
//# sourceMappingURL=privecy-policy.controller.js.map