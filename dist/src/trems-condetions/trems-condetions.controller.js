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
exports.TremsCondetionsController = void 0;
const common_1 = require("@nestjs/common");
const trems_condetions_service_1 = require("./trems-condetions.service");
const create_trems_condetion_dto_1 = require("./dto/create-trems-condetion.dto");
const update_trems_condetion_dto_1 = require("./dto/update-trems-condetion.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const company_id_guard_1 = require("../common/guards/company-id.guard");
const company_id_decorator_1 = require("../common/decorators/company-id.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
let TremsCondetionsController = class TremsCondetionsController {
    constructor(tremsCondetionsService) {
        this.tremsCondetionsService = tremsCondetionsService;
    }
    async create(createTremsCondetionDto, companyId) {
        const data = await this.tremsCondetionsService.create(createTremsCondetionDto, companyId);
        return { status: 'success', message: 'Terms & Conditions created successfully', data };
    }
    async findPublic(companyId) {
        const data = await this.tremsCondetionsService.findPublic(companyId);
        return { status: 'success', message: 'Terms & Conditions fetched successfully', data };
    }
    async findAll(companyId) {
        const data = await this.tremsCondetionsService.findAll(companyId);
        return { status: 'success', message: 'Terms & Conditions fetched successfully', data };
    }
    async findOne(id, companyId) {
        const data = await this.tremsCondetionsService.findOne(id, companyId);
        return { status: 'success', message: 'Terms & Conditions fetched successfully', data };
    }
    async update(id, updateTremsCondetionDto, companyId) {
        const data = await this.tremsCondetionsService.update(id, updateTremsCondetionDto, companyId);
        return { status: 'success', message: 'Terms & Conditions updated successfully', data };
    }
    async remove(id, companyId) {
        await this.tremsCondetionsService.remove(id, companyId);
        return { status: 'success', message: 'Terms & Conditions removed successfully' };
    }
};
exports.TremsCondetionsController = TremsCondetionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_trems_condetion_dto_1.CreateTremsCondetionDto, String]),
    __metadata("design:returntype", Promise)
], TremsCondetionsController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TremsCondetionsController.prototype, "findPublic", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TremsCondetionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], TremsCondetionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_trems_condetion_dto_1.UpdateTremsCondetionDto, String]),
    __metadata("design:returntype", Promise)
], TremsCondetionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], TremsCondetionsController.prototype, "remove", null);
exports.TremsCondetionsController = TremsCondetionsController = __decorate([
    (0, common_1.Controller)('trems-condetions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    __metadata("design:paramtypes", [trems_condetions_service_1.TremsCondetionsService])
], TremsCondetionsController);
//# sourceMappingURL=trems-condetions.controller.js.map