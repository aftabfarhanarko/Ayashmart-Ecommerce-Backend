import { Repository } from 'typeorm';
import { CashExpense } from './entities/cash-expense.entity';
import { CashIncome } from './entities/cash-income.entity';
import { Order } from '../orders/entities/order.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
declare class CreateIncomeDto {
    title: string;
    amount: number;
    category?: string;
    note?: string;
    date: string;
}
export declare class CashService {
    private readonly expenseRepo;
    private readonly incomeRepo;
    private readonly orderRepo;
    constructor(expenseRepo: Repository<CashExpense>, incomeRepo: Repository<CashIncome>, orderRepo: Repository<Order>);
    getSummary(companyId: string): Promise<{
        totalIncome: number;
        invoiceIncome: number;
        manualIncome: number;
        totalExpense: number;
        netCash: number;
    }>;
    findAllIncomes(companyId: string): Promise<CashIncome[]>;
    createIncome(companyId: string, dto: CreateIncomeDto): Promise<CashIncome>;
    updateIncome(companyId: string, id: number, dto: Partial<CreateIncomeDto>): Promise<CashIncome>;
    removeIncome(companyId: string, id: number): Promise<{
        message: string;
    }>;
    findAll(companyId: string): Promise<CashExpense[]>;
    create(companyId: string, dto: CreateExpenseDto): Promise<CashExpense>;
    update(companyId: string, id: number, dto: UpdateExpenseDto): Promise<CashExpense>;
    remove(companyId: string, id: number): Promise<{
        message: string;
    }>;
}
export {};
