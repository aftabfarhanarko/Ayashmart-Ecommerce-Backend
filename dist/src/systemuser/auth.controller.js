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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const systemuser_service_1 = require("./systemuser.service");
const superadmin_service_1 = require("../superadmin/superadmin.service");
const login_dto_1 = require("./dto/login.dto");
const login_dto_2 = require("../superadmin/dto/login.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const update_systemuser_dto_1 = require("./dto/update-systemuser.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const public_decorator_1 = require("../common/decorators/public.decorator");
let AuthController = class AuthController {
    constructor(systemuserService, superadminService) {
        this.systemuserService = systemuserService;
        this.superadminService = superadminService;
    }
    login(dto) {
        return this.systemuserService.login(dto);
    }
    superadminLogin(dto) {
        return this.superadminService.login(dto);
    }
    async getCurrentUser(req) {
        const userId = req.user?.userId || req.user?.sub;
        const userRole = req.user?.role;
        if (!userId || isNaN(Number(userId))) {
            return {
                success: false,
                message: 'User not found - invalid user ID',
            };
        }
        const userIdNumber = Number(userId);
        if (userRole === 'SUPER_ADMIN') {
            const superadmin = await this.superadminService.findOne(userIdNumber);
            return {
                success: true,
                data: superadmin,
            };
        }
        const user = await this.systemuserService.findOne(userIdNumber);
        return {
            success: true,
            data: user,
        };
    }
    async updateCurrentUser(req, dto) {
        const userId = req.user?.userId || req.user?.sub;
        if (!userId || isNaN(Number(userId))) {
            return {
                success: false,
                message: 'User not found - invalid user ID',
            };
        }
        const updated = await this.systemuserService.update(Number(userId), dto);
        return {
            success: true,
            data: updated,
        };
    }
    forgotPassword(dto) {
        return this.systemuserService.forgotPassword(dto);
    }
    resetPassword(userId, token, dto) {
        return this.systemuserService.resetPassword(+userId, token, dto);
    }
    async refreshToken(body) {
        if (!body.refreshToken) {
            return {
                success: false,
                message: 'Refresh token is required',
            };
        }
        try {
            const tokens = await this.systemuserService.refreshToken(body.refreshToken);
            return {
                success: true,
                data: tokens,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to refresh token',
            };
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('superadmin/login'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_2.SuperadminLoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "superadminLogin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('me'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_systemuser_dto_1.UpdateSystemuserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateCurrentUser", null);
__decorate([
    (0, common_1.Post)('forget-password'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('forget-password/:userId/:token'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('token')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [systemuser_service_1.SystemuserService,
        superadmin_service_1.SuperadminService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map