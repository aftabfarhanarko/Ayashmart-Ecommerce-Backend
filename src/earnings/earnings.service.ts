import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { SystemUser } from '../systemuser/entities/systemuser.entity';
import { Invoice, InvoiceStatus } from '../invoice/entities/invoice.entity';

@Injectable()
export class EarningsService {
    constructor(
        @InjectRepository(SystemUser)
        private readonly systemUserRepo: Repository<SystemUser>,
        @InjectRepository(Invoice)
        private readonly invoiceRepo: Repository<Invoice>,
    ) { }

    async getEarningsOverview() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const yearStart = new Date(currentYear, 0, 1);

        // Get all invoices
        const allInvoices = await this.invoiceRepo.find({
            where: { deletedAt: IsNull() },
            relations: ['customer'],
        });

        // Filter invoices for current year
        const yearInvoices = allInvoices.filter(invoice => 
            invoice.createdAt >= yearStart
        );

        // Total Earnings (YTD) - from PAID invoices only
        const totalEarningsYTD = yearInvoices
            .filter(invoice => invoice.status === InvoiceStatus.PAID)
            .reduce((sum, invoice) => sum + Number(invoice.paidAmount || 0), 0);

        // All invoices data
        const allPayments = allInvoices.map(invoice => ({
            amount: Number(invoice.totalAmount || 0),
            paidAmount: Number(invoice.paidAmount || 0),
            status: invoice.status,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
            customerId: invoice.customerId,
            amountType: invoice.amountType,
        }));

        // Last 30 days payments
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const recentPayments = allPayments.filter(
            (p) => p.createdAt >= thirtyDaysAgo || p.updatedAt >= thirtyDaysAgo,
        );

        // Average Daily Revenue (last 30 days) - from PAID invoices
        const totalRecentRevenue = recentPayments
            .filter((p) => p.status === InvoiceStatus.PAID)
            .reduce((sum, p) => sum + (p.paidAmount || 0), 0);
        const avgDailyRevenue = totalRecentRevenue / 30;

        // Paid vs Pending
        const paidAmount = allPayments
            .filter((p) => p.status === InvoiceStatus.PAID)
            .reduce((sum, p) => sum + (p.paidAmount || 0), 0);
        const pendingAmount = allPayments
            .filter((p) => p.status === InvoiceStatus.PENDING)
            .reduce((sum, p) => sum + (p.amount - p.paidAmount || 0), 0);
        const totalAmount = allPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const paidPercentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;
        const pendingPercentage = totalAmount > 0 ? (pendingAmount / totalAmount) * 100 : 0;

        // Active Markets (count of unique customers with paid invoices)
        const activeMarkets = new Set(
            allInvoices
                .filter(invoice => invoice.status === InvoiceStatus.PAID)
                .map(invoice => invoice.customerId),
        ).size;

        // Monthly earnings for chart (last 8 months)
        const monthlyEarnings: { month: string; totalPNL: number }[] = [];
        for (let i = 7; i >= 0; i--) {
            const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
            const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59);

            const monthInvoices = allInvoices.filter(
                (invoice) =>
                    invoice.createdAt >= monthStart && invoice.createdAt <= monthEnd,
            );

            const monthTotal = monthInvoices
                .filter((invoice) => invoice.status === InvoiceStatus.PAID)
                .reduce((sum, invoice) => sum + Number(invoice.paidAmount || 0), 0);

            monthlyEarnings.push({
                month: `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}-01`,
                totalPNL: monthTotal,
            });
        }

        // Payout status breakdown
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const clearedPayouts = allInvoices
            .filter(
                (invoice) =>
                    invoice.status === InvoiceStatus.PAID &&
                    invoice.updatedAt >= last7Days,
            )
            .reduce((sum, invoice) => sum + Number(invoice.paidAmount || 0), 0);

        const scheduledPending = allInvoices
            .filter((invoice) => invoice.status === InvoiceStatus.PENDING)
            .reduce((sum, invoice) => sum + Number(invoice.dueAmount || 0), 0);

        const disputedOnHold = allInvoices
            .filter(
                (invoice) =>
                    invoice.status === InvoiceStatus.FAILED ||
                    invoice.status === InvoiceStatus.CANCELLED,
            )
            .reduce((sum, invoice) => sum + Number(invoice.totalAmount || 0), 0);

        // Channel breakdown (using amountType as channels)
        const channelBreakdown: Record<string, number> = {};
        allInvoices.forEach((invoice) => {
            if (invoice.status === InvoiceStatus.PAID) {
                const channel = invoice.amountType || 'Other';
                channelBreakdown[channel] = (channelBreakdown[channel] || 0) + Number(invoice.paidAmount || 0);
            }
        });

        // Calculate percentage changes (simplified - comparing last month vs previous month)
        const lastMonthTotal = monthlyEarnings[monthlyEarnings.length - 1]?.totalPNL || 0;
        const previousMonthTotal = monthlyEarnings[monthlyEarnings.length - 2]?.totalPNL || 0;
        const earningsDelta =
            previousMonthTotal > 0 ? ((lastMonthTotal - previousMonthTotal) / previousMonthTotal) * 100 : 0;

        const avgDailyDelta =
            recentPayments.length > 0
                ? ((avgDailyRevenue - (totalRecentRevenue / 60)) / (totalRecentRevenue / 60)) * 100
                : 0;

        return {
            kpis: {
                totalEarningsYTD: totalEarningsYTD,
                avgDailyRevenue: avgDailyRevenue,
                paidPercentage: paidPercentage,
                pendingPercentage: pendingPercentage,
                activeMarkets: activeMarkets,
                earningsDelta: earningsDelta,
                avgDailyDelta: avgDailyDelta,
            },
            chartData: monthlyEarnings,
            payoutStatus: {
                clearedPayouts: clearedPayouts,
                scheduledPending: scheduledPending,
                disputedOnHold: disputedOnHold,
            },
            channelBreakdown: Object.entries(channelBreakdown).map(([name, amount]) => ({
                name,
                amount,
            })),
        };
    }
}
