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
exports.CashController = void 0;
const common_1 = require("@nestjs/common");
const cash_service_1 = require("./cash.service");
const create_expense_dto_1 = require("./dto/create-expense.dto");
const update_expense_dto_1 = require("./dto/update-expense.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const company_id_guard_1 = require("../common/guards/company-id.guard");
let CashController = class CashController {
    constructor(cashService) {
        this.cashService = cashService;
    }
    getSummary(req) {
        const companyId = req.user?.companyId;
        return this.cashService.getSummary(companyId);
    }
    getIncomes(req) {
        const companyId = req.user?.companyId;
        return this.cashService.findAllIncomes(companyId);
    }
    createIncome(req, body) {
        const companyId = req.user?.companyId;
        return this.cashService.createIncome(companyId, body);
    }
    updateIncome(req, id, body) {
        const companyId = req.user?.companyId;
        return this.cashService.updateIncome(companyId, id, body);
    }
    deleteIncome(req, id) {
        const companyId = req.user?.companyId;
        return this.cashService.removeIncome(companyId, id);
    }
    getExpenses(req) {
        const companyId = req.user?.companyId;
        return this.cashService.findAll(companyId);
    }
    createExpense(req, dto) {
        const companyId = req.user?.companyId;
        return this.cashService.create(companyId, dto);
    }
    updateExpense(req, id, dto) {
        const companyId = req.user?.companyId;
        return this.cashService.update(companyId, id, dto);
    }
    deleteExpense(req, id) {
        const companyId = req.user?.companyId;
        return this.cashService.remove(companyId, id);
    }
};
exports.CashController = CashController;
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CashController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('incomes'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CashController.prototype, "getIncomes", null);
__decorate([
    (0, common_1.Post)('incomes'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CashController.prototype, "createIncome", null);
__decorate([
    (0, common_1.Patch)('incomes/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", void 0)
], CashController.prototype, "updateIncome", null);
__decorate([
    (0, common_1.Delete)('incomes/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], CashController.prototype, "deleteIncome", null);
__decorate([
    (0, common_1.Get)('expenses'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CashController.prototype, "getExpenses", null);
__decorate([
    (0, common_1.Post)('expenses'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_expense_dto_1.CreateExpenseDto]),
    __metadata("design:returntype", void 0)
], CashController.prototype, "createExpense", null);
__decorate([
    (0, common_1.Patch)('expenses/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_expense_dto_1.UpdateExpenseDto]),
    __metadata("design:returntype", void 0)
], CashController.prototype, "updateExpense", null);
__decorate([
    (0, common_1.Delete)('expenses/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], CashController.prototype, "deleteExpense", null);
exports.CashController = CashController = __decorate([
    (0, common_1.Controller)('cash'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_id_guard_1.CompanyIdGuard),
    __metadata("design:paramtypes", [cash_service_1.CashService])
], CashController);
//# sourceMappingURL=cash.controller.js.map