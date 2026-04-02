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
exports.FraudcheckerController = void 0;
const common_1 = require("@nestjs/common");
const fraudchecker_service_1 = require("./fraudchecker.service");
const ban_user_dto_1 = require("../users/dto/ban-user.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const company_id_guard_1 = require("../common/guards/company-id.guard");
let FraudcheckerController = class FraudcheckerController {
    constructor(fraudcheckerService) {
        this.fraudcheckerService = fraudcheckerService;
    }
    async check(email, name, phone) {
        const provided = [email, name, phone].filter((v) => v && v.trim() !== '');
        if (provided.length !== 1) {
            throw new common_1.BadRequestException('Provide exactly one of email, name, or phone');
        }
        if (email) {
            const risk = await this.fraudcheckerService.checkUserRiskByEmail(email);
            return { statusCode: common_1.HttpStatus.OK, message: 'User risk evaluated by email', data: risk };
        }
        if (phone) {
            const risk = await this.fraudcheckerService.checkUserRiskByPhone(phone);
            return { statusCode: common_1.HttpStatus.OK, message: 'User risk evaluated by phone', data: risk };
        }
        const risks = await this.fraudcheckerService.checkUserRiskByName(name);
        return { statusCode: common_1.HttpStatus.OK, message: 'Users risk evaluated by name', data: risks };
    }
    async flagUser(id, dto) {
        const banned = await this.fraudcheckerService.flagUser(id, dto?.reason);
        return { statusCode: common_1.HttpStatus.OK, message: 'User flagged (banned)', data: banned };
    }
    async unflagUser(id) {
        const unbanned = await this.fraudcheckerService.unflagUser(id);
        return { statusCode: common_1.HttpStatus.OK, message: 'User unflagged (unbanned)', data: unbanned };
    }
    async checkExternal(phone) {
        if (!phone || phone.trim() === '') {
            throw new common_1.BadRequestException('phone query parameter is required');
        }
        const result = await this.fraudcheckerService.checkByPhoneExternal(phone.trim());
        return { statusCode: common_1.HttpStatus.OK, message: 'External fraud check completed', data: result };
    }
};
exports.FraudcheckerController = FraudcheckerController;
__decorate([
    (0, common_1.Get)('users/check'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, common_1.Query)('name')),
    __param(2, (0, common_1.Query)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], FraudcheckerController.prototype, "check", null);
__decorate([
    (0, common_1.Patch)('users/:id/flag'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, ban_user_dto_1.BanUserDto]),
    __metadata("design:returntype", Promise)
], FraudcheckerController.prototype, "flagUser", null);
__decorate([
    (0, common_1.Patch)('users/:id/unflag'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FraudcheckerController.prototype, "unflagUser", null);
__decorate([
    (0, common_1.Get)('external/check'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FraudcheckerController.prototype, "checkExternal", null);
exports.FraudcheckerController = FraudcheckerController = __decorate([
    (0, common_1.Controller)('fraudchecker'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    __metadata("design:paramtypes", [fraudchecker_service_1.FraudcheckerService])
], FraudcheckerController);
//# sourceMappingURL=fraudchecker.controller.js.map