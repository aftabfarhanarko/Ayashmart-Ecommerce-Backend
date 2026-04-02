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
exports.ResellerController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const company_id_decorator_1 = require("../common/decorators/company-id.decorator");
const reseller_service_1 = require("./reseller.service");
const system_user_role_enum_1 = require("../systemuser/system-user-role.enum");
const request_payout_dto_1 = require("./dto/request-payout.dto");
let ResellerController = class ResellerController {
    constructor(resellerService) {
        this.resellerService = resellerService;
    }
    async getSummary(companyId, req) {
        const { userId, sub, role } = req.user || {};
        if (role !== system_user_role_enum_1.SystemUserRole.RESELLER) {
            return {
                statusCode: common_1.HttpStatus.FORBIDDEN,
                message: 'Only resellers can access this endpoint',
            };
        }
        const resellerId = +(userId || sub);
        const data = await this.resellerService.getSummary(resellerId, companyId);
        return {
            statusCode: common_1.HttpStatus.OK,
            data,
        };
    }
    async listPayouts(companyId, req) {
        const { userId, sub, role } = req.user || {};
        if (role !== system_user_role_enum_1.SystemUserRole.RESELLER) {
            return {
                statusCode: common_1.HttpStatus.FORBIDDEN,
                message: 'Only resellers can access this endpoint',
            };
        }
        const resellerId = +(userId || sub);
        const data = await this.resellerService.listPayouts(resellerId, companyId);
        return {
            statusCode: common_1.HttpStatus.OK,
            data,
        };
    }
    async getPayoutInvoice(id, companyId, req) {
        const { userId, sub, role } = req.user || {};
        if (role !== system_user_role_enum_1.SystemUserRole.RESELLER) {
            return {
                statusCode: common_1.HttpStatus.FORBIDDEN,
                message: 'Only resellers can access payout invoice',
            };
        }
        const resellerId = +(userId || sub);
        const data = await this.resellerService.getPayoutInvoice(id, resellerId, companyId);
        return {
            statusCode: common_1.HttpStatus.OK,
            data,
        };
    }
    async requestPayout(companyId, req, body) {
        const { userId, sub, role } = req.user || {};
        if (role !== system_user_role_enum_1.SystemUserRole.RESELLER) {
            return {
                statusCode: common_1.HttpStatus.FORBIDDEN,
                message: 'Only resellers can request payouts',
            };
        }
        const resellerId = +(userId || sub);
        const data = await this.resellerService.requestPayout(resellerId, companyId, body);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Payout request created',
            data,
        };
    }
    async adminResellersList(companyId, req) {
        const { role } = req.user || {};
        if (role !== system_user_role_enum_1.SystemUserRole.SYSTEM_OWNER &&
            role !== system_user_role_enum_1.SystemUserRole.SUPER_ADMIN) {
            return {
                statusCode: common_1.HttpStatus.FORBIDDEN,
                message: 'Only system owners or super admins can view resellers list',
            };
        }
        const data = await this.resellerService.adminResellersList(companyId);
        return {
            statusCode: common_1.HttpStatus.OK,
            data,
        };
    }
    async adminListPayouts(companyId, req) {
        const { role } = req.user || {};
        if (role !== system_user_role_enum_1.SystemUserRole.SYSTEM_OWNER &&
            role !== system_user_role_enum_1.SystemUserRole.SUPER_ADMIN) {
            return {
                statusCode: common_1.HttpStatus.FORBIDDEN,
                message: 'Only system owners or super admins can view payouts',
            };
        }
        const data = await this.resellerService.adminListPayouts(companyId);
        return {
            statusCode: common_1.HttpStatus.OK,
            data,
        };
    }
    async adminGetPayoutInvoice(id, companyId, req) {
        const { role } = req.user || {};
        if (role !== system_user_role_enum_1.SystemUserRole.SYSTEM_OWNER &&
            role !== system_user_role_enum_1.SystemUserRole.SUPER_ADMIN) {
            return {
                statusCode: common_1.HttpStatus.FORBIDDEN,
                message: 'Only system owners or super admins can access payout invoice',
            };
        }
        const data = await this.resellerService.adminGetPayoutInvoice(id, companyId);
        return {
            statusCode: common_1.HttpStatus.OK,
            data,
        };
    }
    async markPayoutPaid(id, req) {
        const { role } = req.user || {};
        if (role !== system_user_role_enum_1.SystemUserRole.SYSTEM_OWNER &&
            role !== system_user_role_enum_1.SystemUserRole.SUPER_ADMIN) {
            return {
                statusCode: common_1.HttpStatus.FORBIDDEN,
                message: 'Only system owners or super admins can mark payouts paid',
            };
        }
        const data = await this.resellerService.markPayoutPaid(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Payout marked as paid',
            data,
        };
    }
    async approveReseller(id, req) {
        const { role } = req.user || {};
        if (role !== system_user_role_enum_1.SystemUserRole.SYSTEM_OWNER &&
            role !== system_user_role_enum_1.SystemUserRole.SUPER_ADMIN) {
            return {
                statusCode: common_1.HttpStatus.FORBIDDEN,
                message: 'Only system owners or super admins can approve resellers',
            };
        }
        const data = await this.resellerService.approveReseller(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Reseller approved',
            data,
        };
    }
    async deleteReseller(id, req) {
        const { role } = req.user || {};
        if (role !== system_user_role_enum_1.SystemUserRole.SYSTEM_OWNER &&
            role !== system_user_role_enum_1.SystemUserRole.SUPER_ADMIN) {
            return {
                statusCode: common_1.HttpStatus.FORBIDDEN,
                message: 'Only system owners or super admins can delete resellers',
            };
        }
        const data = await this.resellerService.deleteReseller(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Reseller deleted',
            data,
        };
    }
};
exports.ResellerController = ResellerController;
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResellerController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('payouts'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResellerController.prototype, "listPayouts", null);
__decorate([
    (0, common_1.Get)('payouts/:id/invoice'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], ResellerController.prototype, "getPayoutInvoice", null);
__decorate([
    (0, common_1.Post)('payouts/request'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, request_payout_dto_1.RequestPayoutDto]),
    __metadata("design:returntype", Promise)
], ResellerController.prototype, "requestPayout", null);
__decorate([
    (0, common_1.Get)('admin/resellers'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResellerController.prototype, "adminResellersList", null);
__decorate([
    (0, common_1.Get)('admin/payouts'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResellerController.prototype, "adminListPayouts", null);
__decorate([
    (0, common_1.Get)('admin/payouts/:id/invoice'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], ResellerController.prototype, "adminGetPayoutInvoice", null);
__decorate([
    (0, common_1.Post)('admin/payouts/:id/mark-paid'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ResellerController.prototype, "markPayoutPaid", null);
__decorate([
    (0, common_1.Post)('admin/resellers/:id/approve'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ResellerController.prototype, "approveReseller", null);
__decorate([
    (0, common_1.Delete)('admin/resellers/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ResellerController.prototype, "deleteReseller", null);
exports.ResellerController = ResellerController = __decorate([
    (0, common_1.Controller)('reseller'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [reseller_service_1.ResellerService])
], ResellerController);
//# sourceMappingURL=reseller.controller.js.map