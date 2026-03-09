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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const company_id_guard_1 = require("../common/guards/company-id.guard");
const company_id_decorator_1 = require("../common/decorators/company-id.decorator");
const user_id_decorator_1 = require("../common/decorators/user-id.decorator");
const system_user_role_enum_1 = require("../systemuser/system-user-role.enum");
const public_decorator_1 = require("../common/decorators/public.decorator");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async create(dto, companyIdFromQuery, companyIdFromToken, req) {
        const companyId = companyIdFromQuery || companyIdFromToken;
        if (!companyId) {
            throw new common_1.BadRequestException('companyId is required');
        }
        const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
            ? +(req.user.userId || req.user.sub) : undefined;
        const o = await this.orderService.create(dto, companyId, performedByUserId);
        return { statusCode: 201, message: "Order created", data: o };
    }
    async getMyOrders(userId, companyId) {
        const o = await this.orderService.findByCustomerId(userId, companyId);
        return { statusCode: 200, message: 'User orders fetched', data: o };
    }
    async getByCustomer(id, companyId) {
        const o = await this.orderService.findByCustomerId(id, companyId);
        return { statusCode: 200, message: 'Customer orders fetched', data: o };
    }
    async findAll(companyId, resellerIdFromQuery, req) {
        const role = req?.user?.role;
        const numericUserId = +(req?.user?.userId || req?.user?.sub);
        const resellerId = role === system_user_role_enum_1.SystemUserRole.RESELLER
            ? numericUserId
            : resellerIdFromQuery
                ? +resellerIdFromQuery
                : undefined;
        const o = await this.orderService.findAll(companyId, resellerId);
        return { statusCode: 200, data: o };
    }
    async getStats(companyId) {
        const stats = await this.orderService.getStats(companyId);
        return { statusCode: 200, data: stats };
    }
    async findOne(id, companyId) {
        const o = await this.orderService.findOne(id, companyId);
        return { statusCode: 200, data: o };
    }
    async process(id, companyId, req) {
        const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
            ? +(req.user.userId || req.user.sub) : undefined;
        const o = await this.orderService.processOrder(id, companyId, performedByUserId);
        return { statusCode: 200, message: "Order processing", data: o };
    }
    async complete(id, body, companyId, req) {
        const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
            ? +(req.user.userId || req.user.sub) : undefined;
        const o = await this.orderService.completeOrder(id, companyId, body?.paymentRef, performedByUserId);
        return { statusCode: 200, message: "Order completed", data: o };
    }
    async deliver(id, body, companyId, req) {
        const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
            ? +(req.user.userId || req.user.sub) : undefined;
        const o = await this.orderService.deliverOrder(id, companyId, body?.userId, body?.permissions, body?.comment, body?.markAsPaid, performedByUserId);
        return { statusCode: 200, message: "Order delivered", data: o };
    }
    async cancel(id, body, companyId, req) {
        const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
            ? +(req.user.userId || req.user.sub) : undefined;
        const res = await this.orderService.cancelOrder(id, companyId, body?.comment, performedByUserId);
        return { statusCode: 200, ...res };
    }
    async success(id, companyId, req) {
        const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
            ? +(req.user.userId || req.user.sub) : undefined;
        const o = await this.orderService.deliverOrder(id, companyId, undefined, undefined, undefined, undefined, performedByUserId);
        return { statusCode: 200, message: "Order success", data: o };
    }
    async ship(id, body, companyId, req) {
        const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
            ? +(req.user.userId || req.user.sub) : undefined;
        const o = await this.orderService.shipOrder(id, companyId, body?.trackingId, body?.provider, performedByUserId);
        return { statusCode: 200, message: "Order shipped", data: o };
    }
    async partialPayment(id, body, companyId, req) {
        const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
            ? +(req.user.userId || req.user.sub) : undefined;
        const o = await this.orderService.recordPartialPayment(id, companyId, body?.amount ?? 0, body?.paymentRef, performedByUserId);
        return { statusCode: 200, message: "Partial payment recorded", data: o };
    }
    async refund(id, companyId, req) {
        const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
            ? +(req.user.userId || req.user.sub) : undefined;
        const o = await this.orderService.refundOrder(id, companyId, performedByUserId);
        return { statusCode: 200, message: "Order refunded", data: o };
    }
    async barcodeScan(body, companyId, req) {
        const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
            ? +(req.user.userId || req.user.sub) : undefined;
        const res = await this.orderService.recordBarcodeScan(body?.trackingId ?? "", companyId, performedByUserId);
        return { statusCode: 200, message: "Barcode scan recorded", data: res };
    }
    async delete(id, companyId, req) {
        const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
            ? +(req.user.userId || req.user.sub) : undefined;
        await this.orderService.softDelete(id, companyId, performedByUserId);
        return { statusCode: 200, message: "Order moved to trash" };
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, String, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my-orders'),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getMyOrders", null);
__decorate([
    (0, common_1.Get)('customer/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getByCustomer", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __param(1, (0, common_1.Query)('resellerId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id/process"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "process", null);
__decorate([
    (0, common_1.Patch)(":id/complete"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "complete", null);
__decorate([
    (0, common_1.Patch)(":id/deliver"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "deliver", null);
__decorate([
    (0, common_1.Patch)(":id/cancel"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)(":id/success"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "success", null);
__decorate([
    (0, common_1.Patch)(":id/ship"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "ship", null);
__decorate([
    (0, common_1.Patch)(":id/partial-payment"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "partialPayment", null);
__decorate([
    (0, common_1.Patch)(":id/refund"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "refund", null);
__decorate([
    (0, common_1.Post)("barcode-scan"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "barcodeScan", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "delete", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)("orders"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    __metadata("design:paramtypes", [orders_service_1.OrderService])
], OrderController);
//# sourceMappingURL=orders.controller.js.map