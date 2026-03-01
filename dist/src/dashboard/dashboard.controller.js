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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("./dashboard.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const company_id_guard_1 = require("../common/guards/company-id.guard");
const company_id_decorator_1 = require("../common/decorators/company-id.decorator");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getDashboard(companyId) {
        const data = await this.dashboardService.getDashboardData(companyId);
        return {
            statusCode: 200,
            message: 'Dashboard data retrieved successfully',
            data,
        };
    }
    async getStats(companyId) {
        const data = await this.dashboardService.getCustomerStats(companyId);
        return {
            statusCode: 200,
            message: 'Stats retrieved successfully',
            data,
        };
    }
    async getCategoryStats(companyId) {
        const data = await this.dashboardService.getCategoryStats(companyId);
        return {
            statusCode: 200,
            message: 'Category stats retrieved successfully',
            data,
        };
    }
    async getAiDailyReport(companyId) {
        const data = await this.dashboardService.getAiDailyReport(companyId);
        return {
            statusCode: 200,
            message: 'AI daily report generated successfully',
            data,
        };
    }
    async translateReport(companyId, body) {
        const data = await this.dashboardService.translateReport(companyId, body);
        return {
            statusCode: 200,
            message: 'Report translated successfully',
            data,
        };
    }
    async getAiLiveMessages(companyId) {
        const data = await this.dashboardService.getAiLiveMessages(companyId);
        return {
            statusCode: 200,
            message: 'AI live messages retrieved successfully',
            data,
        };
    }
    async getAiSalesDirection(companyId) {
        const data = await this.dashboardService.getAiSalesDirection(companyId);
        return {
            statusCode: 200,
            message: 'AI sales direction retrieved successfully',
            data,
        };
    }
    async suggestDescription(companyId, body) {
        const data = await this.dashboardService.suggestAiDescription(companyId, body);
        return {
            statusCode: 200,
            message: 'AI description suggestion generated successfully',
            data,
        };
    }
    async getStatistics(companyId) {
        const data = await this.dashboardService.getStatistics(companyId);
        return {
            statusCode: 200,
            message: 'Statistics retrieved successfully',
            data,
        };
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('categories-stats'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getCategoryStats", null);
__decorate([
    (0, common_1.Get)('ai-report'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAiDailyReport", null);
__decorate([
    (0, common_1.Post)('ai-report/translate'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "translateReport", null);
__decorate([
    (0, common_1.Get)('ai-messages'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAiLiveMessages", null);
__decorate([
    (0, common_1.Get)('ai-sales-direction'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAiSalesDirection", null);
__decorate([
    (0, common_1.Post)('ai-suggest-description'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "suggestDescription", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStatistics", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map