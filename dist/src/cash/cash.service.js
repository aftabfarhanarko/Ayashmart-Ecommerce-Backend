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
exports.CashService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cash_expense_entity_1 = require("./entities/cash-expense.entity");
const cash_income_entity_1 = require("./entities/cash-income.entity");
const order_entity_1 = require("../orders/entities/order.entity");
class CreateIncomeDto {
}
let CashService = class CashService {
    constructor(expenseRepo, incomeRepo, orderRepo) {
        this.expenseRepo = expenseRepo;
        this.incomeRepo = incomeRepo;
        this.orderRepo = orderRepo;
    }
    async getSummary(companyId) {
        const allOrders = await this.orderRepo.find({ where: { companyId } });
        const invoiceIncome = allOrders
            .filter((o) => o.isPaid || o.status === 'paid' || o.status === 'delivered')
            .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
        const manualIncomeResult = await this.incomeRepo
            .createQueryBuilder('ci')
            .select('COALESCE(SUM(ci.amount), 0)', 'manualIncome')
            .where('ci.companyId = :companyId', { companyId })
            .andWhere('ci.deletedAt IS NULL')
            .getRawOne();
        const expenseResult = await this.expenseRepo
            .createQueryBuilder('ce')
            .select('COALESCE(SUM(ce.amount), 0)', 'totalExpense')
            .where('ce.companyId = :companyId', { companyId })
            .andWhere('ce.deletedAt IS NULL')
            .getRawOne();
        const manualIncome = parseFloat(manualIncomeResult?.manualIncome ?? '0');
        const totalIncome = invoiceIncome + manualIncome;
        const totalExpense = parseFloat(expenseResult?.totalExpense ?? '0');
        const netCash = totalIncome - totalExpense;
        return { totalIncome, invoiceIncome, manualIncome, totalExpense, netCash };
    }
    async findAllIncomes(companyId) {
        return this.incomeRepo.find({
            where: { companyId },
            order: { date: 'DESC', createdAt: 'DESC' },
        });
    }
    async createIncome(companyId, dto) {
        const income = this.incomeRepo.create({ ...dto, companyId });
        return this.incomeRepo.save(income);
    }
    async updateIncome(companyId, id, dto) {
        const income = await this.incomeRepo.findOne({ where: { id, companyId } });
        if (!income)
            throw new common_1.NotFoundException('Income entry not found');
        Object.assign(income, dto);
        return this.incomeRepo.save(income);
    }
    async removeIncome(companyId, id) {
        const income = await this.incomeRepo.findOne({ where: { id, companyId } });
        if (!income)
            throw new common_1.NotFoundException('Income entry not found');
        await this.incomeRepo.softDelete(id);
        return { message: 'Income entry deleted' };
    }
    async findAll(companyId) {
        return this.expenseRepo.find({
            where: { companyId },
            order: { date: 'DESC', createdAt: 'DESC' },
        });
    }
    async create(companyId, dto) {
        const expense = this.expenseRepo.create({ ...dto, companyId });
        return this.expenseRepo.save(expense);
    }
    async update(companyId, id, dto) {
        const expense = await this.expenseRepo.findOne({ where: { id, companyId } });
        if (!expense)
            throw new common_1.NotFoundException('Expense not found');
        Object.assign(expense, dto);
        return this.expenseRepo.save(expense);
    }
    async remove(companyId, id) {
        const expense = await this.expenseRepo.findOne({ where: { id, companyId } });
        if (!expense)
            throw new common_1.NotFoundException('Expense not found');
        await this.expenseRepo.softDelete(id);
        return { message: 'Expense deleted' };
    }
};
exports.CashService = CashService;
exports.CashService = CashService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cash_expense_entity_1.CashExpense)),
    __param(1, (0, typeorm_1.InjectRepository)(cash_income_entity_1.CashIncome)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CashService);
//# sourceMappingURL=cash.service.js.map