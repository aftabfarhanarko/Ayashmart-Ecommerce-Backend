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
exports.SaleInvoiceController = void 0;
const common_1 = require("@nestjs/common");
const sale_invoice_service_1 = require("./sale-invoice.service");
const create_sale_invoice_dto_1 = require("./dto/create-sale-invoice.dto");
const update_sale_invoice_dto_1 = require("./dto/update-sale-invoice.dto");
const swagger_1 = require("@nestjs/swagger");
let SaleInvoiceController = class SaleInvoiceController {
    constructor(saleInvoiceService) {
        this.saleInvoiceService = saleInvoiceService;
    }
    create(createSaleInvoiceDto, companyId) {
        return this.saleInvoiceService.create(createSaleInvoiceDto, companyId);
    }
    findAll(companyId) {
        return this.saleInvoiceService.findAll(companyId);
    }
    async sendEmail(id, companyId, body) {
        return this.saleInvoiceService.sendEmail(+id, companyId, body.pdfBase64);
    }
    findOne(id, companyId) {
        return this.saleInvoiceService.findOne(+id, companyId);
    }
    update(id, companyId, updateDto) {
        return this.saleInvoiceService.update(+id, companyId, updateDto);
    }
    remove(id, companyId) {
        return this.saleInvoiceService.remove(+id, companyId);
    }
    revert(id, companyId) {
        return this.saleInvoiceService.revert(+id, companyId);
    }
};
exports.SaleInvoiceController = SaleInvoiceController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new sale invoice' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sale_invoice_dto_1.CreateSaleInvoiceDto, String]),
    __metadata("design:returntype", void 0)
], SaleInvoiceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all sale invoices for the company' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: true }),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SaleInvoiceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(':id/send-email'),
    (0, swagger_1.ApiOperation)({ summary: 'Send invoice as PDF to customer email' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: true }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SaleInvoiceController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific sale invoice' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: true }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SaleInvoiceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a sale invoice (status, delivery, fulfillment)' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: true }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_sale_invoice_dto_1.UpdateSaleInvoiceDto]),
    __metadata("design:returntype", void 0)
], SaleInvoiceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a sale invoice' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: true }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SaleInvoiceController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/revert'),
    (0, swagger_1.ApiOperation)({ summary: 'Revert (cancel) a sale invoice' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: true }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SaleInvoiceController.prototype, "revert", null);
exports.SaleInvoiceController = SaleInvoiceController = __decorate([
    (0, swagger_1.ApiTags)('Sale Invoices'),
    (0, common_1.Controller)('sale-invoices'),
    __metadata("design:paramtypes", [sale_invoice_service_1.SaleInvoiceService])
], SaleInvoiceController);
//# sourceMappingURL=sale-invoice.controller.js.map