import { CashService } from './cash.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
export declare class CashController {
    private readonly cashService;
    constructor(cashService: CashService);
    getSummary(req: any): Promise<{
        totalIncome: number;
        invoiceIncome: number;
        manualIncome: number;
        totalExpense: number;
        netCash: number;
    }>;
    getIncomes(req: any): Promise<import("./entities/cash-income.entity").CashIncome[]>;
    createIncome(req: any, body: any): Promise<import("./entities/cash-income.entity").CashIncome>;
    updateIncome(req: any, id: number, body: any): Promise<import("./entities/cash-income.entity").CashIncome>;
    deleteIncome(req: any, id: number): Promise<{
        message: string;
    }>;
    getExpenses(req: any): Promise<import("./entities/cash-expense.entity").CashExpense[]>;
    createExpense(req: any, dto: CreateExpenseDto): Promise<import("./entities/cash-expense.entity").CashExpense>;
    updateExpense(req: any, id: number, dto: UpdateExpenseDto): Promise<import("./entities/cash-expense.entity").CashExpense>;
    deleteExpense(req: any, id: number): Promise<{
        message: string;
    }>;
}
