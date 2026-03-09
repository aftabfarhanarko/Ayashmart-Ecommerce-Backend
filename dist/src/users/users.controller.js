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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const update_user_dto_1 = require("./dto/update-user.dto");
const ban_user_dto_1 = require("./dto/ban-user.dto");
const login_dto_1 = require("./dto/login.dto");
const query_users_dto_1 = require("./dto/query-users.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const company_id_guard_1 = require("../common/guards/company-id.guard");
const company_id_decorator_1 = require("../common/decorators/company-id.decorator");
const user_id_decorator_1 = require("../common/decorators/user-id.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async register(body, companyIdFromQuery) {
        const companyId = body.companyId || companyIdFromQuery;
        const { companyId: _ignored, ...createUserDto } = body;
        if (!companyId) {
            throw new common_1.BadRequestException('CompanyId is required');
        }
        if (!createUserDto.password) {
            throw new common_1.BadRequestException('Password is required');
        }
        const user = await this.usersService.create(createUserDto, companyId);
        let accessToken;
        let safeUser = user;
        try {
            const loginResult = await this.usersService.login(createUserDto.email, createUserDto.password, companyId);
            accessToken = loginResult.accessToken;
            safeUser = loginResult.user;
        }
        catch (e) {
            console.error('Auto-login after register failed:', e);
        }
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'User registered successfully',
            data: user,
            ...(accessToken && safeUser ? { accessToken, user: safeUser } : {}),
        };
    }
    async login(loginDto) {
        const { accessToken, user } = await this.usersService.login(loginDto.email, loginDto.password, loginDto.companyId);
        return { statusCode: common_1.HttpStatus.OK, message: 'Login successful', accessToken, user };
    }
    async forgotPassword(body, companyIdFromQuery) {
        const companyId = body.companyId || companyIdFromQuery;
        if (!companyId) {
            throw new common_1.BadRequestException('CompanyId is required');
        }
        const result = await this.usersService.requestPasswordReset(body.email, companyId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: result.message,
            data: { success: result.success, message: result.message },
        };
    }
    async resetPassword(userId, token, body, companyIdFromQuery) {
        const companyId = body.companyId || companyIdFromQuery;
        if (!companyId) {
            throw new common_1.BadRequestException('CompanyId is required');
        }
        const result = await this.usersService.resetPassword(userId, token, body.password, body.confirmPassword, companyId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: result.message,
            data: result,
        };
    }
    async initialSetPassword(body, companyIdFromQuery) {
        const companyId = body.companyId || companyIdFromQuery;
        if (!companyId) {
            throw new common_1.BadRequestException('CompanyId is required');
        }
        const result = await this.usersService.initialSetPassword({
            email: body.email,
            companyId,
            password: body.password,
            confirmPassword: body.confirmPassword,
            orderId: body.orderId,
        });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: result.message,
            data: result,
        };
    }
    async create(body, companyIdFromQuery) {
        const companyId = body.companyId || companyIdFromQuery;
        const { companyId: _ignored, ...createUserDto } = body;
        if (!companyId) {
            throw new common_1.BadRequestException('CompanyId is required');
        }
        const user = await this.usersService.create(createUserDto, companyId);
        let accessToken;
        let safeUser = user;
        if (createUserDto.password) {
            try {
                const loginResult = await this.usersService.login(createUserDto.email, createUserDto.password, companyId);
                accessToken = loginResult.accessToken;
                safeUser = loginResult.user;
            }
            catch (e) {
                console.error('Auto-login after user create failed:', e);
            }
        }
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'User created',
            data: user,
            ...(accessToken && safeUser ? { accessToken, user: safeUser } : {}),
        };
    }
    async getCurrentUser(userId, companyId) {
        const user = await this.usersService.findOne(userId, companyId);
        return { statusCode: common_1.HttpStatus.OK, message: 'Current user fetched', data: user };
    }
    async updateCurrentUser(userId, updateUserDto, companyId) {
        const updated = await this.usersService.update(userId, updateUserDto, companyId);
        return { statusCode: common_1.HttpStatus.OK, message: 'Profile updated', data: updated };
    }
    async findAll(companyId, query) {
        const filters = {};
        if (query.isBanned !== undefined)
            filters.isBanned = query.isBanned === 'true';
        if (query.isActive !== undefined)
            filters.isActive = query.isActive === 'true';
        if (query.successfulOrders)
            filters.successfulOrders = query.successfulOrders;
        if (query.cancelledOrders)
            filters.cancelledOrders = query.cancelledOrders;
        const users = await this.usersService.findAll(companyId, Object.keys(filters).length ? filters : undefined);
        return { statusCode: common_1.HttpStatus.OK, message: 'Users list fetched', data: users };
    }
    async findOne(id, companyId) {
        const user = await this.usersService.findOne(id, companyId);
        return { statusCode: common_1.HttpStatus.OK, message: 'User fetched', data: user };
    }
    async update(id, updateUserDto, companyId) {
        const updated = await this.usersService.update(id, updateUserDto, companyId);
        return { statusCode: common_1.HttpStatus.OK, message: 'User updated', data: updated };
    }
    async ban(id, dto, companyId) {
        const banned = await this.usersService.ban(id, companyId, dto?.reason);
        return { statusCode: common_1.HttpStatus.OK, message: 'User banned', data: banned };
    }
    async unban(id, companyId) {
        const unbanned = await this.usersService.unban(id, companyId);
        return { statusCode: common_1.HttpStatus.OK, message: 'User unbanned', data: unbanned };
    }
    async remove(id, companyId) {
        await this.usersService.remove(id, companyId);
        return { statusCode: common_1.HttpStatus.OK, message: 'User removed' };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('register'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password/:userId/:token'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('token')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('initial-set-password'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "initialSetPassword", null);
__decorate([
    (0, common_1.Post)(),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateUserDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateCurrentUser", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_users_dto_1.QueryUsersDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateUserDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/ban'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, ban_user_dto_1.BanUserDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "ban", null);
__decorate([
    (0, common_1.Patch)(':id/unban'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "unban", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map