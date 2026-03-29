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
exports.SuperadminSettingController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const setting_service_1 = require("./setting.service");
const update_smtp_dto_1 = require("./dto/update-smtp.dto");
const SUPERADMIN_SMTP_COMPANY_ID = '__SUPERADMIN_SMTP__';
let SuperadminSettingController = class SuperadminSettingController {
    constructor(settingService) {
        this.settingService = settingService;
    }
    assertSuperAdmin(req) {
        const role = req?.user?.role;
        if (role !== 'SUPER_ADMIN') {
            throw new common_1.ForbiddenException('Access denied');
        }
    }
    async getSmtp(req) {
        this.assertSuperAdmin(req);
        try {
            const data = await this.settingService.findFirstByCompanyId(SUPERADMIN_SMTP_COMPANY_ID);
            return { status: 'success', message: 'SMTP fetched successfully', data };
        }
        catch {
            return { status: 'success', message: 'SMTP fetched successfully', data: null };
        }
    }
    async upsertSmtp(dto, req) {
        this.assertSuperAdmin(req);
        const data = await this.settingService.upsertSmtp(SUPERADMIN_SMTP_COMPANY_ID, dto);
        return { status: 'success', message: 'SMTP updated successfully', data };
    }
};
exports.SuperadminSettingController = SuperadminSettingController;
__decorate([
    (0, common_1.Get)('smtp'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuperadminSettingController.prototype, "getSmtp", null);
__decorate([
    (0, common_1.Patch)('smtp'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_smtp_dto_1.UpdateSmtpDto, Object]),
    __metadata("design:returntype", Promise)
], SuperadminSettingController.prototype, "upsertSmtp", null);
exports.SuperadminSettingController = SuperadminSettingController = __decorate([
    (0, common_1.Controller)('superadmin/setting'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [setting_service_1.SettingService])
], SuperadminSettingController);
//# sourceMappingURL=superadmin-setting.controller.js.map