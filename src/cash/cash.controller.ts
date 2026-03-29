import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CashService } from './cash.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyIdGuard } from '../common/guards/company-id.guard';

@Controller('cash')
@UseGuards(JwtAuthGuard, CompanyIdGuard)
export class CashController {
  constructor(private readonly cashService: CashService) {}

  /** GET /cash/summary  — Income total, Expense total, Net Cash */
  @Get('summary')
  getSummary(@Request() req: any) {
    const companyId: string = req.user?.companyId;
    return this.cashService.getSummary(companyId);
  }

  // ─── Income Endpoints ───────────────────────────────────────

  /** GET /cash/incomes */
  @Get('incomes')
  getIncomes(@Request() req: any) {
    const companyId: string = req.user?.companyId;
    return this.cashService.findAllIncomes(companyId);
  }

  /** POST /cash/incomes */
  @Post('incomes')
  createIncome(@Request() req: any, @Body() body: any) {
    const companyId: string = req.user?.companyId;
    return this.cashService.createIncome(companyId, body);
  }

  /** PATCH /cash/incomes/:id */
  @Patch('incomes/:id')
  updateIncome(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    const companyId: string = req.user?.companyId;
    return this.cashService.updateIncome(companyId, id, body);
  }

  /** DELETE /cash/incomes/:id */
  @Delete('incomes/:id')
  deleteIncome(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    const companyId: string = req.user?.companyId;
    return this.cashService.removeIncome(companyId, id);
  }

  // ─── Expense Endpoints ──────────────────────────────────────

  /** GET /cash/expenses */
  @Get('expenses')
  getExpenses(@Request() req: any) {
    const companyId: string = req.user?.companyId;
    return this.cashService.findAll(companyId);
  }

  /** POST /cash/expenses */
  @Post('expenses')
  createExpense(@Request() req: any, @Body() dto: CreateExpenseDto) {
    const companyId: string = req.user?.companyId;
    return this.cashService.create(companyId, dto);
  }

  /** PATCH /cash/expenses/:id */
  @Patch('expenses/:id')
  updateExpense(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExpenseDto,
  ) {
    const companyId: string = req.user?.companyId;
    return this.cashService.update(companyId, id, dto);
  }

  /** DELETE /cash/expenses/:id */
  @Delete('expenses/:id')
  deleteExpense(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const companyId: string = req.user?.companyId;
    return this.cashService.remove(companyId, id);
  }
}
