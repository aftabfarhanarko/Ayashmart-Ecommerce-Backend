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
exports.InvoiceController = void 0;
const common_1 = require("@nestjs/common");
const invoice_service_1 = require("./invoice.service");
const create_invoice_dto_1 = require("./dto/create-invoice.dto");
const update_invoice_dto_1 = require("./dto/update-invoice.dto");
const initiate_bkash_payment_dto_1 = require("./dto/initiate-bkash-payment.dto");
const bkash_callback_dto_1 = require("./dto/bkash-callback.dto");
const bank_payment_dto_1 = require("./dto/bank-payment.dto");
const reject_bank_payment_dto_1 = require("./dto/reject-bank-payment.dto");
const public_decorator_1 = require("../common/decorators/public.decorator");
let InvoiceController = class InvoiceController {
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    create(createInvoiceDto) {
        return this.invoiceService.create(createInvoiceDto);
    }
    findAll(customerId) {
        if (customerId) {
            return this.invoiceService.findByCustomer(+customerId);
        }
        return this.invoiceService.findAll();
    }
    findByInvoiceNumber(invoiceNumber) {
        return this.invoiceService.findByInvoiceNumber(invoiceNumber);
    }
    findOne(id) {
        return this.invoiceService.findOne(+id);
    }
    update(id, updateInvoiceDto) {
        return this.invoiceService.update(+id, updateInvoiceDto);
    }
    async initiateBkashPayment(initiatePaymentDto) {
        return this.invoiceService.initiateBkashPayment(initiatePaymentDto);
    }
    async executeBkashPayment(paymentID) {
        return this.invoiceService.executeBkashPayment(paymentID);
    }
    async bkashCallback(bkashCallbackDto) {
        return this.invoiceService.processBkashCallback(bkashCallbackDto);
    }
    async bkashCallbackGet(query) {
        return this.invoiceService.processBkashCallback(query);
    }
    async processBankPayment(bankPaymentDto) {
        return this.invoiceService.processBankPayment(bankPaymentDto);
    }
    async verifyBankPayment(id) {
        return this.invoiceService.verifyBankPayment(+id);
    }
    async rejectBankPayment(id, rejectDto) {
        return this.invoiceService.rejectBankPayment(+id, rejectDto?.reason);
    }
    remove(id) {
        return this.invoiceService.remove(+id);
    }
};
exports.InvoiceController = InvoiceController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_invoice_dto_1.CreateInvoiceDto]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('number/:invoiceNumber'),
    __param(0, (0, common_1.Param)('invoiceNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "findByInvoiceNumber", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_invoice_dto_1.UpdateInvoiceDto]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('payment/bkash/initiate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [initiate_bkash_payment_dto_1.InitiateBkashPaymentDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "initiateBkashPayment", null);
__decorate([
    (0, common_1.Post)('payment/bkash/execute/:paymentID'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('paymentID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "executeBkashPayment", null);
__decorate([
    (0, common_1.Post)('payment/bkash/callback'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bkash_callback_dto_1.BkashCallbackDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "bkashCallback", null);
__decorate([
    (0, common_1.Get)('payment/bkash/callback'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bkash_callback_dto_1.BkashCallbackDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "bkashCallbackGet", null);
__decorate([
    (0, common_1.Post)('payment/bank'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bank_payment_dto_1.BankPaymentDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "processBankPayment", null);
__decorate([
    (0, common_1.Post)('payment/bank/verify/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "verifyBankPayment", null);
__decorate([
    (0, common_1.Post)('payment/bank/reject/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reject_bank_payment_dto_1.RejectBankPaymentDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "rejectBankPayment", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "remove", null);
exports.InvoiceController = InvoiceController = __decorate([
    (0, common_1.Controller)('invoice'),
    __metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], InvoiceController);
//# sourceMappingURL=invoice.controller.js.map