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
exports.SystemuserController = void 0;
const common_1 = require("@nestjs/common");
const systemuser_service_1 = require("./systemuser.service");
const activity_log_service_1 = require("./activity-log.service");
const create_systemuser_dto_1 = require("./dto/create-systemuser.dto");
const update_systemuser_dto_1 = require("./dto/update-systemuser.dto");
const login_dto_1 = require("./dto/login.dto");
const assign_permissions_dto_1 = require("./dto/assign-permissions.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const company_id_decorator_1 = require("../common/decorators/company-id.decorator");
const system_user_role_enum_1 = require("./system-user-role.enum");
const activity_log_entity_1 = require("./entities/activity-log.entity");
const public_decorator_1 = require("../common/decorators/public.decorator");
let SystemuserController = class SystemuserController {
    constructor(systemuserService, activityLogService) {
        this.systemuserService = systemuserService;
        this.activityLogService = activityLogService;
    }
    async createSystemOwner(createSystemuserDto, creatorCompanyId, req) {
        createSystemuserDto.role = system_user_role_enum_1.SystemUserRole.SYSTEM_OWNER;
        const creatorRole = req?.user?.role || system_user_role_enum_1.SystemUserRole.EMPLOYEE;
        const performedByUserId = req?.user?.userId || req?.user?.sub;
        return this.systemuserService.create(createSystemuserDto, creatorCompanyId, creatorRole, performedByUserId);
    }
    create(createSystemuserDto, creatorCompanyId, req) {
        const creatorRole = req?.user?.role;
        const performedByUserId = req?.user?.userId || req?.user?.sub;
        return this.systemuserService.create(createSystemuserDto, creatorCompanyId, creatorRole, performedByUserId);
    }
    login(dto) {
        return this.systemuserService.login(dto);
    }
    findAll(companyId, req) {
        const userRole = req?.user?.role;
        if (userRole === 'SUPER_ADMIN' || userRole === system_user_role_enum_1.SystemUserRole.SUPER_ADMIN) {
            return this.systemuserService.findAll(undefined);
        }
        return this.systemuserService.findAll(companyId);
    }
    async listTrash(companyIdFromQuery, companyIdFromToken, req) {
        const userRole = req?.user?.role;
        if (userRole === 'SUPER_ADMIN' || userRole === system_user_role_enum_1.SystemUserRole.SUPER_ADMIN) {
            return this.systemuserService.listTrashed(undefined);
        }
        const companyId = companyIdFromQuery || companyIdFromToken;
        return this.systemuserService.listTrashed(companyId);
    }
    async getActivityLogs(companyId, performedByUserId, targetUserId, action, entity, startDate, endDate, limit, offset, req) {
        const userRole = req?.user?.role;
        const currentUserId = req?.user?.userId || req?.user?.sub;
        const filters = {};
        if (userRole !== system_user_role_enum_1.SystemUserRole.SYSTEM_OWNER && userRole !== system_user_role_enum_1.SystemUserRole.SUPER_ADMIN && userRole !== 'SUPER_ADMIN') {
            filters.performedByUserId = currentUserId;
            filters.targetUserId = currentUserId;
        }
        else {
            if (performedByUserId)
                filters.performedByUserId = +performedByUserId;
            if (targetUserId)
                filters.targetUserId = +targetUserId;
        }
        if (action)
            filters.action = action;
        if (entity)
            filters.entity = entity;
        if (startDate)
            filters.startDate = new Date(startDate);
        if (endDate)
            filters.endDate = new Date(endDate);
        if (limit)
            filters.limit = +limit;
        if (offset)
            filters.offset = +offset;
        const filterCompanyId = (userRole === 'SUPER_ADMIN' || userRole === system_user_role_enum_1.SystemUserRole.SUPER_ADMIN) ? undefined : (companyId || '');
        return this.activityLogService.getActivityLogs(filterCompanyId, filters);
    }
    async getActivityLogById(id, companyId, req) {
        const userRole = req?.user?.role;
        const currentUserId = req?.user?.userId || req?.user?.sub;
        const filterCompanyId = (userRole === 'SUPER_ADMIN' || userRole === system_user_role_enum_1.SystemUserRole.SUPER_ADMIN) ? undefined : (companyId || '');
        const activityLog = await this.activityLogService.getActivityLogById(+id, filterCompanyId);
        if (!activityLog) {
            throw new common_1.NotFoundException('Activity log not found');
        }
        if (userRole !== system_user_role_enum_1.SystemUserRole.SYSTEM_OWNER && userRole !== system_user_role_enum_1.SystemUserRole.SUPER_ADMIN && userRole !== 'SUPER_ADMIN') {
            if (activityLog.performedByUserId !== currentUserId && activityLog.targetUserId !== currentUserId) {
                throw new common_1.BadRequestException('You can only view your own activity logs');
            }
        }
        return activityLog;
    }
    findOne(id, companyId, req) {
        const userRole = req?.user?.role;
        if (userRole === 'SUPER_ADMIN' || userRole === system_user_role_enum_1.SystemUserRole.SUPER_ADMIN) {
            return this.systemuserService.findOne(+id, undefined);
        }
        return this.systemuserService.findOne(+id, companyId);
    }
    async revertPackage(id, companyId, req) {
        const performedByUserId = req?.user?.userId || req?.user?.sub;
        const userRole = req?.user?.role;
        if (performedByUserId !== +id && userRole !== 'SUPER_ADMIN' && userRole !== system_user_role_enum_1.SystemUserRole.SUPER_ADMIN) {
            throw new common_1.BadRequestException('You can only revert your own package');
        }
        const filterCompanyId = (userRole === 'SUPER_ADMIN' || userRole === system_user_role_enum_1.SystemUserRole.SUPER_ADMIN) ? undefined : companyId;
        return this.systemuserService.revertToPreviousPackage(+id, filterCompanyId, performedByUserId);
    }
    update(id, updateSystemuserDto, companyId, req) {
        const performedByUserId = req?.user?.userId || req?.user?.sub;
        const userRole = req?.user?.role;
        const filterCompanyId = (userRole === 'SUPER_ADMIN' || userRole === system_user_role_enum_1.SystemUserRole.SUPER_ADMIN) ? undefined : companyId;
        return this.systemuserService.update(+id, updateSystemuserDto, filterCompanyId, performedByUserId);
    }
    async restore(id, companyIdFromQuery, companyIdFromToken, req) {
        const performedByUserId = req?.user?.userId || req?.user?.sub;
        const userRole = req?.user?.role;
        const filterCompanyId = userRole === 'SUPER_ADMIN' || userRole === system_user_role_enum_1.SystemUserRole.SUPER_ADMIN
            ? undefined
            : (companyIdFromQuery || companyIdFromToken);
        return this.systemuserService.restore(+id, filterCompanyId, performedByUserId);
    }
    remove(id, companyId, req) {
        const performedByUserId = req?.user?.userId || req?.user?.sub;
        const userRole = req?.user?.role;
        const filterCompanyId = (userRole === 'SUPER_ADMIN' || userRole === system_user_role_enum_1.SystemUserRole.SUPER_ADMIN) ? undefined : companyId;
        return this.systemuserService.remove(+id, filterCompanyId, performedByUserId);
    }
    async permanentRemove(id, companyId, req) {
        const performedByUserId = req?.user?.userId || req?.user?.sub;
        const userRole = req?.user?.role;
        const filterCompanyId = (userRole === 'SUPER_ADMIN' || userRole === system_user_role_enum_1.SystemUserRole.SUPER_ADMIN) ? undefined : companyId;
        return this.systemuserService.permanentDelete(+id, filterCompanyId, performedByUserId);
    }
    async assignPermissions(id, dto, companyId, req) {
        const assignerPermissions = req?.user?.permissions || [];
        const performedByUserId = req?.user?.userId || req?.user?.sub;
        const userRole = req?.user?.role;
        if (userRole !== system_user_role_enum_1.SystemUserRole.SYSTEM_OWNER && userRole !== system_user_role_enum_1.SystemUserRole.SUPER_ADMIN && userRole !== 'SUPER_ADMIN') {
            throw new common_1.BadRequestException('Only System Owners and Super Admins can assign permissions');
        }
        const filterCompanyId = (userRole === 'SUPER_ADMIN' || userRole === system_user_role_enum_1.SystemUserRole.SUPER_ADMIN) ? undefined : companyId;
        return this.systemuserService.assignPermissions(+id, dto.permissions, filterCompanyId, assignerPermissions, performedByUserId);
    }
    async getPermissions(id, companyId, req) {
        const performedByUserId = req?.user?.userId || req?.user?.sub;
        const userRole = req?.user?.role;
        if (userRole !== system_user_role_enum_1.SystemUserRole.SYSTEM_OWNER && userRole !== system_user_role_enum_1.SystemUserRole.SUPER_ADMIN && userRole !== 'SUPER_ADMIN') {
            if (performedByUserId !== +id) {
                throw new common_1.BadRequestException('You can only view your own permissions');
            }
        }
        const filterCompanyId = (userRole === 'SUPER_ADMIN' || userRole === system_user_role_enum_1.SystemUserRole.SUPER_ADMIN) ? undefined : companyId;
        const user = await this.systemuserService.findOne(+id, filterCompanyId);
        return {
            statusCode: 200,
            data: {
                userId: user.id,
                permissions: user.permissions || [],
            },
        };
    }
};
exports.SystemuserController = SystemuserController;
__decorate([
    (0, common_1.Post)('create-system-owner'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_systemuser_dto_1.CreateSystemuserDto, String, Object]),
    __metadata("design:returntype", Promise)
], SystemuserController.prototype, "createSystemOwner", null);
__decorate([
    (0, common_1.Post)(),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_systemuser_dto_1.CreateSystemuserDto, String, Object]),
    __metadata("design:returntype", void 0)
], SystemuserController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], SystemuserController.prototype, "login", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SystemuserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('trash'),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SystemuserController.prototype, "listTrash", null);
__decorate([
    (0, common_1.Get)('activity-logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __param(1, (0, common_1.Query)('performedByUserId')),
    __param(2, (0, common_1.Query)('targetUserId')),
    __param(3, (0, common_1.Query)('action')),
    __param(4, (0, common_1.Query)('entity')),
    __param(5, (0, common_1.Query)('startDate')),
    __param(6, (0, common_1.Query)('endDate')),
    __param(7, (0, common_1.Query)('limit')),
    __param(8, (0, common_1.Query)('offset')),
    __param(9, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], SystemuserController.prototype, "getActivityLogs", null);
__decorate([
    (0, common_1.Get)('activity-logs/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SystemuserController.prototype, "getActivityLogById", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], SystemuserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/revert-package'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SystemuserController.prototype, "revertPackage", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_systemuser_dto_1.UpdateSystemuserDto, String, Object]),
    __metadata("design:returntype", void 0)
], SystemuserController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/restore'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], SystemuserController.prototype, "restore", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], SystemuserController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)(':id/permanent'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SystemuserController.prototype, "permanentRemove", null);
__decorate([
    (0, common_1.Patch)(':id/permissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_permissions_dto_1.AssignPermissionsDto, String, Object]),
    __metadata("design:returntype", Promise)
], SystemuserController.prototype, "assignPermissions", null);
__decorate([
    (0, common_1.Get)(':id/permissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SystemuserController.prototype, "getPermissions", null);
exports.SystemuserController = SystemuserController = __decorate([
    (0, common_1.Controller)('systemuser'),
    __metadata("design:paramtypes", [systemuser_service_1.SystemuserService,
        activity_log_service_1.ActivityLogService])
], SystemuserController);
//# sourceMappingURL=systemuser.controller.js.map