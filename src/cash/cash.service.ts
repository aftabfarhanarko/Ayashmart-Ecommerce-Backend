import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashExpense } from './entities/cash-expense.entity';
import { CashIncome } from './entities/cash-income.entity';
import { SaleInvoice } from '../sale-invoice/entities/sale-invoice.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

// Reuse same DTO shape for income entries
class CreateIncomeDto {
  title: string;
  amount: number;
  category?: string;
  note?: string;
  date: string;
}

@Injectable()
export class CashService {
  constructor(
    @InjectRepository(CashExpense)
    private readonly expenseRepo: Repository<CashExpense>,
    @InjectRepository(CashIncome)
    private readonly incomeRepo: Repository<CashIncome>,
    @InjectRepository(SaleInvoice)
    private readonly saleInvoiceRepo: Repository<SaleInvoice>,
  ) {}

  /** Get aggregated cash summary for a company */
  async getSummary(companyId: string) {
    // Income from sale invoices
    const invoiceResult = await this.saleInvoiceRepo
      .createQueryBuilder('si')
      .select('COALESCE(SUM(si.totalAmount), 0)', 'invoiceIncome')
      .where('si.companyId = :companyId', { companyId })
      .andWhere('si.deletedAt IS NULL')
      .getRawOne();

    // Manually added income entries
    const manualIncomeResult = await this.incomeRepo
      .createQueryBuilder('ci')
      .select('COALESCE(SUM(ci.amount), 0)', 'manualIncome')
      .where('ci.companyId = :companyId', { companyId })
      .andWhere('ci.deletedAt IS NULL')
      .getRawOne();

    // Total expense
    const expenseResult = await this.expenseRepo
      .createQueryBuilder('ce')
      .select('COALESCE(SUM(ce.amount), 0)', 'totalExpense')
      .where('ce.companyId = :companyId', { companyId })
      .andWhere('ce.deletedAt IS NULL')
      .getRawOne();

    const invoiceIncome = parseFloat(invoiceResult?.invoiceIncome ?? '0');
    const manualIncome = parseFloat(manualIncomeResult?.manualIncome ?? '0');
    const totalIncome = invoiceIncome + manualIncome;
    const totalExpense = parseFloat(expenseResult?.totalExpense ?? '0');
    const netCash = totalIncome - totalExpense;

    return { totalIncome, invoiceIncome, manualIncome, totalExpense, netCash };
  }

  // ─── Income CRUD ────────────────────────────────────────────

  async findAllIncomes(companyId: string) {
    return this.incomeRepo.find({
      where: { companyId },
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async createIncome(companyId: string, dto: CreateIncomeDto) {
    const income = this.incomeRepo.create({ ...dto, companyId });
    return this.incomeRepo.save(income);
  }

  async updateIncome(companyId: string, id: number, dto: Partial<CreateIncomeDto>) {
    const income = await this.incomeRepo.findOne({ where: { id, companyId } });
    if (!income) throw new NotFoundException('Income entry not found');
    Object.assign(income, dto);
    return this.incomeRepo.save(income);
  }

  async removeIncome(companyId: string, id: number) {
    const income = await this.incomeRepo.findOne({ where: { id, companyId } });
    if (!income) throw new NotFoundException('Income entry not found');
    await this.incomeRepo.softDelete(id);
    return { message: 'Income entry deleted' };
  }

  // ─── Expense CRUD ───────────────────────────────────────────

  async findAll(companyId: string) {
    return this.expenseRepo.find({
      where: { companyId },
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async create(companyId: string, dto: CreateExpenseDto) {
    const expense = this.expenseRepo.create({ ...dto, companyId });
    return this.expenseRepo.save(expense);
  }

  async update(companyId: string, id: number, dto: UpdateExpenseDto) {
    const expense = await this.expenseRepo.findOne({ where: { id, companyId } });
    if (!expense) throw new NotFoundException('Expense not found');
    Object.assign(expense, dto);
    return this.expenseRepo.save(expense);
  }

  async remove(companyId: string, id: number) {
    const expense = await this.expenseRepo.findOne({ where: { id, companyId } });
    if (!expense) throw new NotFoundException('Expense not found');
    await this.expenseRepo.softDelete(id);
    return { message: 'Expense deleted' };
  }
}
