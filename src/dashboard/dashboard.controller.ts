import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyIdGuard } from '../common/guards/company-id.guard';
import { CompanyId } from '../common/decorators/company-id.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, CompanyIdGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get()
    async getDashboard(@CompanyId() companyId: string) {
        const data = await this.dashboardService.getDashboardData(companyId);
        return {
            statusCode: 200,
            message: 'Dashboard data retrieved successfully',
            data,
        };
    }

    @Get('stats')
    async getStats(@CompanyId() companyId: string) {
        const data = await this.dashboardService.getCustomerStats(companyId);
        return {
            statusCode: 200,
            message: 'Stats retrieved successfully',
            data,
        };
    }

    @Get('categories-stats')
    async getCategoryStats(@CompanyId() companyId: string) {
        const data = await this.dashboardService.getCategoryStats(companyId);
        return {
            statusCode: 200,
            message: 'Category stats retrieved successfully',
            data,
        };
    }

    @Get('ai-report')
    async getAiDailyReport(@CompanyId() companyId: string) {
        const data = await this.dashboardService.getAiDailyReport(companyId);
        return {
            statusCode: 200,
            message: 'AI daily report generated successfully',
            data,
        };
    }

    @Post('ai-report/translate')
    async translateReport(
        @CompanyId() companyId: string,
        @Body() body: { text?: string; targetLang?: string },
    ) {
        const data = await this.dashboardService.translateReport(companyId, body);
        return {
            statusCode: 200,
            message: 'Report translated successfully',
            data,
        };
    }

    @Get('ai-messages')
    async getAiLiveMessages(@CompanyId() companyId: string) {
        const data = await this.dashboardService.getAiLiveMessages(companyId);
        return {
            statusCode: 200,
            message: 'AI live messages retrieved successfully',
            data,
        };
    }

    @Get('ai-sales-direction')
    async getAiSalesDirection(@CompanyId() companyId: string) {
        const data = await this.dashboardService.getAiSalesDirection(companyId);
        return {
            statusCode: 200,
            message: 'AI sales direction retrieved successfully',
            data,
        };
    }

    @Post('ai-suggest-description')
    async suggestDescription(
        @CompanyId() companyId: string,
        @Body() body: { context?: string; type?: string; title?: string; lang?: string },
    ) {
        const data = await this.dashboardService.suggestAiDescription(companyId, body);
        return {
            statusCode: 200,
            message: 'AI description suggestion generated successfully',
            data,
        };
    }

    @Get('statistics')
    async getStatistics(@CompanyId() companyId: string) {
        const data = await this.dashboardService.getStatistics(companyId);
        return {
            statusCode: 200,
            message: 'Statistics retrieved successfully',
            data,
        };
    }
}











