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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const ssl_initiate_dto_1 = require("./dto/ssl-initiate.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const public_decorator_1 = require("../common/decorators/public.decorator");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async initiateSsl(dto) {
        const res = await this.paymentsService.initiateSslPayment(dto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'SSL payment initiated',
            data: res,
        };
    }
    async sslCallback(query) {
        if (query?.val_id) {
            const validation = await this.paymentsService.validateSslPayment(query.val_id);
            if (validation && (validation.status === 'VALID' || validation.status === 'VALIDATED')) {
                await this.paymentsService.processPaymentSuccess(query.val_id, validation);
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'SSL payment validated',
                data: validation,
            };
        }
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'SSL callback received',
            data: query,
        };
    }
    async cashOnDelivery(body) {
        const data = await this.paymentsService.createCashOnDelivery(body.orderId, body.amount, body.address);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Cash on delivery placed',
            data,
        };
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('ssl/initiate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ssl_initiate_dto_1.SslInitiateDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "initiateSsl", null);
__decorate([
    (0, common_1.Get)('ssl/callback'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "sslCallback", null);
__decorate([
    (0, common_1.Post)('cod'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "cashOnDelivery", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map