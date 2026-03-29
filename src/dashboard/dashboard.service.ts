import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, IsNull } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { CashService } from '../cash/cash.service';
import axios from 'axios';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Order)
        private orderRepo: Repository<Order>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(ProductEntity)
        private productRepo: Repository<ProductEntity>,
        @InjectRepository(CategoryEntity)
        private categoryRepo: Repository<CategoryEntity>,
        private cashService: CashService,
    ) { }

    async getDashboardData(companyId: string) {
        try {
            const now = new Date();
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

            // Get all orders for this company
            const allOrders = await this.orderRepo.find({
                where: { companyId },
                relations: ['customer'],
            });

        // Get orders from last 30 days for new customers calculation
        const recentOrders = allOrders.filter(
            (order) => order.createdAt >= thirtyDaysAgo,
        );

        // Calculate stats
        const stats = await this.calculateStats(companyId, allOrders, recentOrders);

        // Calculate line chart data (last 7 days)
        const lineChartData = await this.getLineChartData(companyId, sevenDaysAgo, now);

        // Calculate radial chart data (paid vs unpaid)
        const radialChartData = this.getRadialChartData(allOrders);

        // Get recent orders (last 10)
        const recentOrdersList = await this.getRecentOrders(companyId, 10);

        // Get best selling products
        const bestSellers = await this.getBestSellingProducts(companyId, 3);

        // Get top customers
        const topCustomers = await this.getTopCustomers(companyId, 3);

        // Product stats for overview metrics
        const productStats = await this.getProductStats(companyId);
        const customerStats = await this.getCustomerStats(companyId);

        // Overview metrics (for top 4 metric cards)
        const paidOrders = allOrders.filter(
            (o) => o.isPaid || o.status === 'paid' || o.status === 'delivered',
        );
        const totalRevenue = paidOrders.reduce(
            (sum, o) => sum + Number(o.totalAmount || 0),
            0,
        );

        // Get cash summary: manualIncome additions and expense deductions
        const cashSummary = await this.cashService.getSummary(companyId);

        const overviewMetrics = {
            totalProducts: productStats.totalProducts,
            totalSales: customerStats.totalOrders,
            // Net Revenue = paid orders revenue + manual income − expenses
            totalRevenue: Math.round((totalRevenue + cashSummary.manualIncome - cashSummary.totalExpense) * 100) / 100,
            totalStoreViews: customerStats.totalCustomers,
        };

        // Recent products (last 15)
        const recentProducts = await this.getRecentProducts(companyId, 15);

        // Sales overview by period (for chart filter)
        const salesOverview = {
            daily: await this.getSalesOverviewByPeriod(companyId, 'daily'),
            weekly: await this.getSalesOverviewByPeriod(companyId, 'weekly'),
            monthly: await this.getSalesOverviewByPeriod(companyId, 'monthly'),
            yearly: await this.getSalesOverviewByPeriod(companyId, 'yearly'),
        };

        // Subscriber/customer growth by period
        const subscriberChart = {
            daily: await this.getSubscriberChartByPeriod(companyId, 'daily'),
            weekly: await this.getSubscriberChartByPeriod(companyId, 'weekly'),
            monthly: await this.getSubscriberChartByPeriod(companyId, 'monthly'),
            yearly: await this.getSubscriberChartByPeriod(companyId, 'yearly'),
        };

        // Recent transactions (orders as transactions)
        const recentTransactions = await this.getRecentTransactions(companyId, 15);

        // Recent customers (from recent orders)
        const recentCustomers = await this.getRecentCustomers(companyId, 15);

        // Sales distribution (paid vs unpaid vs cancelled)
        const salesDistribution = this.getSalesDistribution(allOrders);

        // Integrations (empty until integrations API exists)
        const integrations: Array<{ id: number; name: string; type: string; rate: string; profit: string }> = [];

            return {
                stats,
                lineChartData,
                radialChartData,
                recentOrders: recentOrdersList,
                bestSellers,
                topCustomers,
                productStats,
                overviewMetrics,
                recentProducts,
                salesOverview,
                subscriberChart,
                recentTransactions,
                recentCustomers,
                salesDistribution,
                integrations,
            };
        } catch (error) {
            console.error('Error in getDashboardData:', error);
            throw error;
        }
    }

    private async calculateStats(
        companyId: string,
        allOrders: Order[],
        recentOrders: Order[],
    ) {
        // Ecommerce Revenue (total from all paid/delivered orders)
        const paidOrders = allOrders.filter(
            (order) => order.isPaid || order.status === 'paid' || order.status === 'delivered',
        );
        const totalRevenue = paidOrders.reduce(
            (sum, order) => sum + Number(order.totalAmount || 0),
            0,
        );

        // Previous period revenue for comparison (orders from 30-60 days ago)
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        const previousPeriodOrders = allOrders.filter(
            (order) =>
                order.createdAt >= sixtyDaysAgo && order.createdAt < thirtyDaysAgo,
        );
        const previousRevenue = previousPeriodOrders
            .filter(
                (order) =>
                    order.isPaid || order.status === 'paid' || order.status === 'delivered',
            )
            .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
        const revenueDelta =
            previousRevenue > 0
                ? (((totalRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1)
                : '0.0';
        const revenueDeltaSign = totalRevenue >= previousRevenue ? '+' : '';

        // New Customers (customers created in last 30 days)
        const newCustomersCount = await this.userRepo.count({
            where: {
                companyId,
                createdAt: Between(thirtyDaysAgo, now),
            },
        });

        // Previous period new customers
        const previousNewCustomers = await this.userRepo.count({
            where: {
                companyId,
                createdAt: Between(sixtyDaysAgo, thirtyDaysAgo),
            },
        });
        const customersDelta =
            previousNewCustomers > 0
                ? (
                    ((newCustomersCount - previousNewCustomers) /
                        previousNewCustomers) *
                    100
                ).toFixed(1)
                : '0.0';
        const customersDeltaSign = newCustomersCount >= previousNewCustomers ? '+' : '';

        // Repeat Purchase Rate (customers with more than 1 order)
        const customerOrderCounts = new Map<number, number>();
        recentOrders.forEach((order) => {
            if (order.customer?.id) {
                customerOrderCounts.set(
                    order.customer.id,
                    (customerOrderCounts.get(order.customer.id) || 0) + 1,
                );
            }
        });
        const repeatCustomers = Array.from(customerOrderCounts.values()).filter(
            (count) => count > 1,
        ).length;
        const totalCustomersWithOrders = customerOrderCounts.size;
        const repeatPurchaseRate =
            totalCustomersWithOrders > 0
                ? ((repeatCustomers / totalCustomersWithOrders) * 100).toFixed(2)
                : '0.00';

        // Previous period repeat purchase rate
        const previousPeriodCustomerCounts = new Map<number, number>();
        previousPeriodOrders.forEach((order) => {
            if (order.customer?.id) {
                previousPeriodCustomerCounts.set(
                    order.customer.id,
                    (previousPeriodCustomerCounts.get(order.customer.id) || 0) + 1,
                );
            }
        });
        const previousRepeatCustomers = Array.from(
            previousPeriodCustomerCounts.values(),
        ).filter((count) => count > 1).length;
        const previousTotalCustomers = previousPeriodCustomerCounts.size;
        const previousRepeatRate =
            previousTotalCustomers > 0
                ? ((previousRepeatCustomers / previousTotalCustomers) * 100).toFixed(2)
                : '0.00';
        const repeatDelta =
            previousRepeatRate !== '0.00'
                ? (
                    ((parseFloat(repeatPurchaseRate) - parseFloat(previousRepeatRate)) /
                        parseFloat(previousRepeatRate)) *
                    100
                ).toFixed(1)
                : '0.0';
        const repeatDeltaSign =
            parseFloat(repeatPurchaseRate) >= parseFloat(previousRepeatRate) ? '+' : '';

        // Average Order Value
        const avgOrderValue =
            paidOrders.length > 0
                ? totalRevenue / paidOrders.length
                : 0;
        const previousAvgOrderValue =
            previousPeriodOrders.length > 0
                ? previousPeriodOrders
                    .filter(
                        (order) =>
                            order.isPaid ||
                            order.status === 'paid' ||
                            order.status === 'delivered',
                    )
                    .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0) /
                previousPeriodOrders.filter(
                    (order) =>
                        order.isPaid ||
                        order.status === 'paid' ||
                        order.status === 'delivered',
                ).length
                : 0;
        const avgOrderDelta =
            previousAvgOrderValue > 0
                ? (
                    ((avgOrderValue - previousAvgOrderValue) / previousAvgOrderValue) *
                    100
                ).toFixed(1)
                : '0.0';
        const avgOrderDeltaSign = avgOrderValue >= previousAvgOrderValue ? '+' : '';

        return [
            {
                title: 'Ecommerce Revenue',
                value: `$${totalRevenue.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
                delta: `${revenueDeltaSign}${revenueDelta}%`,
                tone: parseFloat(revenueDelta) >= 0 ? 'green' : 'red',
            },
            {
                title: 'New Customers',
                value: newCustomersCount.toString(),
                delta: `${customersDeltaSign}${customersDelta}%`,
                tone: parseFloat(customersDelta) >= 0 ? 'green' : 'red',
            },
            {
                title: 'Repeat Purchase Rate',
                value: `${repeatPurchaseRate}%`,
                delta: `${repeatDeltaSign}${repeatDelta}%`,
                tone: parseFloat(repeatDelta) >= 0 ? 'blue' : 'red',
            },
            {
                title: 'Average Order Value',
                value: `$${avgOrderValue.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
                delta: `${avgOrderDeltaSign}${avgOrderDelta}%`,
                tone: parseFloat(avgOrderDelta) >= 0 ? 'default' : 'red',
            },
        ];
    }

    private async getLineChartData(
        companyId: string,
        startDate: Date,
        endDate: Date,
    ) {
        const orders = await this.orderRepo.find({
            where: {
                companyId,
                createdAt: Between(startDate, endDate),
            },
        });

        // Group orders by date and calculate total PNL (revenue) per day
        const dailyRevenue = new Map<string, number>();

        orders
            .filter(
                (order) =>
                    order.isPaid || order.status === 'paid' || order.status === 'delivered',
            )
            .forEach((order) => {
                const dateKey = order.createdAt.toISOString().split('T')[0];
                const current = dailyRevenue.get(dateKey) || 0;
                dailyRevenue.set(dateKey, current + Number(order.totalAmount || 0));
            });

        // Convert to array format expected by frontend
        const chartData = Array.from(dailyRevenue.entries())
            .map(([date, totalPNL]) => ({
                month: date,
                totalPNL: Math.round(totalPNL * 100) / 100, // Round to 2 decimal places
            }))
            .sort((a, b) => a.month.localeCompare(b.month));

        return chartData;
    }

    private getRadialChartData(orders: Order[]) {
        const paidCount = orders.filter(
            (order) => order.isPaid || order.status === 'paid' || order.status === 'delivered',
        ).length;
        const unpaidCount = orders.filter(
            (order) => !order.isPaid && order.status !== 'paid' && order.status !== 'delivered',
        ).length;

        const total = paidCount + unpaidCount;
        if (total === 0) {
            return [{ paid: 0, unpaid: 0 }];
        }

        const paidPercentage = Math.round((paidCount / total) * 100);
        const unpaidPercentage = 100 - paidPercentage;

        return [{ paid: paidPercentage, unpaid: unpaidPercentage }];
    }

    private async getRecentProducts(companyId: string, limit: number = 15) {
        const products = await this.productRepo.find({
            where: { companyId, deletedAt: IsNull() },
            relations: ['category'],
            order: { createdAt: 'DESC' },
            take: limit,
        });
        return products.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category?.name || 'Uncategorized',
            price: `$${Number(p.price).toFixed(2)}`,
            stock: p.stock,
        }));
    }

    private async getSalesOverviewByPeriod(
        companyId: string,
        period: 'daily' | 'weekly' | 'monthly' | 'yearly',
    ) {
        const now = new Date();
        let startDate: Date;
        const dayMs = 24 * 60 * 60 * 1000;

        switch (period) {
            case 'daily':
                startDate = new Date(now.getTime() - 7 * dayMs);
                break;
            case 'weekly':
                startDate = new Date(now.getTime() - 7 * 7 * dayMs);
                break;
            case 'monthly':
                startDate = new Date(now.getTime() - 12 * 30 * dayMs);
                break;
            case 'yearly':
                startDate = new Date(now.getTime() - 5 * 365 * dayMs);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * dayMs);
        }

        const orders = await this.orderRepo.find({
            where: {
                companyId,
                createdAt: Between(startDate, now),
            },
        });

        const paidOrders = orders.filter(
            (o) => o.isPaid || o.status === 'paid' || o.status === 'delivered',
        );

        const bucketMap = new Map<string, number>();
        paidOrders.forEach((order) => {
            const d = new Date(order.createdAt);
            let key: string;
            if (period === 'daily') {
                key = d.toISOString().split('T')[0];
            } else if (period === 'weekly') {
                const weekStart = new Date(d);
                weekStart.setDate(d.getDate() - d.getDay());
                key = weekStart.toISOString().split('T')[0];
            } else if (period === 'monthly') {
                key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            } else {
                key = String(d.getFullYear());
            }
            bucketMap.set(key, (bucketMap.get(key) || 0) + Number(order.totalAmount || 0));
        });

        const labels = this.generatePeriodLabels(period, startDate, now);
        const dayMs2 = 24 * 60 * 60 * 1000;
        return labels.map((label, i) => {
            let val = 0;
            if (period === 'daily') val = bucketMap.get(label) || 0;
            else if (period === 'weekly') {
                const d = new Date(startDate.getTime() + i * 7 * dayMs2);
                val = bucketMap.get(d.toISOString().split('T')[0]) || 0;
            } else if (period === 'monthly') {
                const y = startDate.getFullYear() + Math.floor(i / 12);
                const m = (i % 12) + 1;
                val = bucketMap.get(`${y}-${String(m).padStart(2, '0')}`) || 0;
            } else val = bucketMap.get(label) || 0;
            return { name: label, totalPNL: Math.round(val * 100) / 100 };
        });
    }

    private generatePeriodLabels(
        period: string,
        start: Date,
        end: Date,
    ): string[] {
        const labels: string[] = [];
        const dayMs = 24 * 60 * 60 * 1000;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        if (period === 'daily') {
            for (let d = new Date(start); d <= end; d.setTime(d.getTime() + dayMs)) {
                labels.push(d.toISOString().split('T')[0]);
            }
        } else if (period === 'weekly') {
            for (let i = 0; i < 7; i++) {
                const d = new Date(start.getTime() + i * 7 * dayMs);
                if (d <= end) labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            }
        } else if (period === 'monthly') {
            for (let y = start.getFullYear(); y <= end.getFullYear(); y++) {
                const mStart = y === start.getFullYear() ? start.getMonth() : 0;
                const mEnd = y === end.getFullYear() ? end.getMonth() : 11;
                for (let m = mStart; m <= mEnd; m++) {
                    labels.push(months[m]);
                }
            }
        } else {
            for (let y = start.getFullYear(); y <= end.getFullYear(); y++) {
                labels.push(String(y));
            }
        }

        if (labels.length === 0) labels.push('N/A');
        return labels;
    }

    private async getSubscriberChartByPeriod(
        companyId: string,
        period: 'daily' | 'weekly' | 'monthly' | 'yearly',
    ) {
        const now = new Date();
        let startDate: Date;
        const dayMs = 24 * 60 * 60 * 1000;

        switch (period) {
            case 'daily':
                startDate = new Date(now.getTime() - 7 * dayMs);
                break;
            case 'weekly':
                startDate = new Date(now.getTime() - 7 * 7 * dayMs);
                break;
            case 'monthly':
                startDate = new Date(now.getTime() - 12 * 30 * dayMs);
                break;
            case 'yearly':
                startDate = new Date(now.getTime() - 5 * 365 * dayMs);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * dayMs);
        }

        const users = await this.userRepo.find({
            where: {
                companyId,
                createdAt: Between(startDate, now),
            },
        });

        const bucketMap = new Map<string, number>();
        users.forEach((user) => {
            const d = new Date(user.createdAt);
            let key: string;
            if (period === 'daily') {
                key = d.toISOString().split('T')[0];
            } else if (period === 'weekly') {
                const weekStart = new Date(d);
                weekStart.setDate(d.getDate() - d.getDay());
                key = weekStart.toISOString().split('T')[0];
            } else if (period === 'monthly') {
                key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            } else {
                key = String(d.getFullYear());
            }
            bucketMap.set(key, (bucketMap.get(key) || 0) + 1);
        });

        const labels = this.generatePeriodLabels(period, startDate, now);
        const dayMs2 = 24 * 60 * 60 * 1000;
        return labels.map((label, i) => {
            let val = 0;
            if (period === 'daily') val = bucketMap.get(label) || 0;
            else if (period === 'weekly') {
                const d = new Date(startDate.getTime() + i * 7 * dayMs2);
                val = bucketMap.get(d.toISOString().split('T')[0]) || 0;
            } else if (period === 'monthly') {
                const y = startDate.getFullYear() + Math.floor(i / 12);
                const m = (i % 12) + 1;
                val = bucketMap.get(`${y}-${String(m).padStart(2, '0')}`) || 0;
            } else val = bucketMap.get(label) || 0;
            return { name: label, value: val };
        });
    }

    private async getRecentTransactions(companyId: string, limit: number = 15) {
        const orders = await this.orderRepo.find({
            where: { companyId },
            relations: ['customer'],
            order: { createdAt: 'DESC' },
            take: limit,
        });

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);

        return orders.map((order) => {
            const d = new Date(order.createdAt);
            const dateLabel =
                d >= todayStart ? 'Today' : d >= yesterdayStart ? 'Yesterday' : d.toLocaleDateString();
            const isPaid =
                order.isPaid || order.status === 'paid' || order.status === 'delivered';
            return {
                id: order.id,
                name: order.customer?.name || order.customerName || 'Guest',
                inv: `#INV${order.id.toString().padStart(6, '0')}`,
                amount: isPaid
                    ? `+ $${Number(order.totalAmount || 0).toFixed(2)}`
                    : `- $${Number(order.paidAmount || 0).toFixed(2)}`,
                type: isPaid ? 'success' : 'danger',
                icon: isPaid ? 'P' : 'S',
                date: dateLabel,
            };
        });
    }

    private async getRecentCustomers(companyId: string, limit: number = 15) {
        const orders = await this.orderRepo.find({
            where: { companyId },
            relations: ['customer'],
            order: { createdAt: 'DESC' },
            take: limit * 2,
        });

        const seen = new Set<number>();
        const result: Array<{ id: number; user: string; ip: string; time: string }> = [];
        for (const order of orders) {
            const cust = order.customer;
            if (cust?.id && !seen.has(cust.id) && result.length < limit) {
                seen.add(cust.id);
                const d = new Date(order.createdAt);
                const diff = Date.now() - d.getTime();
                const timeStr =
                    diff < 2 * 60 * 1000
                        ? '2 min ago'
                        : diff < 60 * 60 * 1000
                            ? `${Math.floor(diff / 60000)} min ago`
                            : diff < 24 * 60 * 60 * 1000
                                ? `${Math.floor(diff / 3600000)} hour ago`
                                : `${Math.floor(diff / 86400000)} days ago`;
                result.push({
                    id: cust.id,
                    user: cust.name || 'Customer',
                    ip: '—',
                    time: timeStr,
                });
            }
        }
        return result;
    }

    private getSalesDistribution(orders: Order[]) {
        const paid = orders.filter(
            (o) => o.isPaid || o.status === 'paid' || o.status === 'delivered',
        ).reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
        const pending = orders
            .filter(
                (o) =>
                    !o.isPaid &&
                    o.status !== 'paid' &&
                    o.status !== 'delivered' &&
                    o.status !== 'cancelled' &&
                    o.status !== 'refunded',
            )
            .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
        const cancelled = orders
            .filter((o) => (o.status?.toLowerCase() || '') === 'cancelled')
            .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

        return [
            { name: 'Paid', value: Math.round(paid * 100) / 100, color: '#5347CE' },
            { name: 'Pending', value: Math.round(pending * 100) / 100, color: '#16C8C7' },
            { name: 'Other', value: Math.round(cancelled * 100) / 100, color: '#E2E8F0' },
        ];
    }

    async getStatistics(companyId: string) {
        const now = new Date();
        
        // Get all orders with customer relations
        const orders = await this.orderRepo.find({ 
            where: { companyId },
            relations: ['customer'],
            order: { createdAt: 'DESC' }
        });
        
        const paidOrders = orders.filter(
            (o) => o.isPaid || o.status === 'paid' || o.status === 'delivered',
        );

        // Chart Data: Last 7 days statistics
        const chartData: Array<{ name: string; earning: number; sells: number; visit: number }> = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            
            const dayOrders = paidOrders.filter(
                (o) => {
                    const orderDate = new Date(o.createdAt);
                    return orderDate >= date && orderDate < nextDate;
                }
            );
            
            const earning = dayOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
            const sells = dayOrders.length;
            const visit = dayOrders.length; // Using order count as visit metric
            
            chartData.push({
                name: dayNames[date.getDay()],
                earning: Math.round(earning),
                sells,
                visit,
            });
        }

        // Country Stats: Using customer districts/addresses or default countries
        // For now, we'll use a default list that can be enhanced with actual customer location data
        const countryStats = [
            { country: 'Canada', users: '0', flag: '🇨🇦' },
            { country: 'Japan', users: '0', flag: '🇯🇵' },
            { country: 'USA', users: '0', flag: '🇺🇸' },
            { country: 'New Zealand', users: '0', flag: '🇳🇿' },
            { country: 'India', users: '0', flag: '🇮🇳' },
            { country: 'Germany', users: '0', flag: '🇩🇪' },
            { country: 'Denmark', users: '0', flag: '🇩🇰' },
        ];
        
        // Get top customers by order amount
        const customerTotals = new Map<string, {
            id: number;
            name: string;
            email: string;
            phone: string;
            totalAmount: number;
            orderCount: number;
            orders: typeof paidOrders;
        }>();

        paidOrders.forEach((order) => {
            // Use customer ID if available, otherwise use email as key
            const key = order.customer?.id 
                ? `customer_${order.customer.id}` 
                : `guest_${order.customerEmail || order.customerName || 'unknown'}`;
            
            const name = order.customer?.name || order.customerName || 'Guest';
            const email = order.customer?.email || order.customerEmail || '';
            const phone = order.customer?.phone || order.customerPhone || '';
            
            const existing = customerTotals.get(key);
            if (existing) {
                existing.totalAmount += Number(order.totalAmount || 0);
                existing.orderCount += 1;
                existing.orders.push(order);
            } else {
                customerTotals.set(key, {
                    id: order.customer?.id || 0,
                    name,
                    email,
                    phone,
                    totalAmount: Number(order.totalAmount || 0),
                    orderCount: 1,
                    orders: [order],
                });
            }
        });

        // Get top 4 customers by total amount
        const topCustomers = Array.from(customerTotals.values())
            .sort((a, b) => b.totalAmount - a.totalAmount)
            .slice(0, 4);

        // Payment Data: Top clients
        const paymentData = topCustomers.map((customer, index) => {
            // Get the most recent order's product name for this customer
            const latestOrder = customer.orders.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )[0];
            const productName = latestOrder?.items?.[0]?.product?.name || 'Payment Page';
            
            return {
                id: index + 1,
                name: customer.name,
                email: customer.email || `customer${index + 1}@example.com`,
                contact: customer.phone || '+91 00000 00000',
                product: productName,
                amount: `$ ${customer.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                avatar: `https://i.pravatar.cc/150?u=${customer.email || index + 1}`,
            };
        });

        // Fill remaining slots with empty data if needed
        while (paymentData.length < 4) {
            paymentData.push({
                id: paymentData.length + 1,
                name: 'N/A',
                email: 'N/A',
                contact: 'N/A',
                product: 'N/A',
                amount: '$ 0',
                avatar: 'https://i.pravatar.cc/150?u=default',
            });
        }

        return {
            chartData,
            countryStats,
            paymentData,
        };
    }

    private async getRecentOrders(companyId: string, limit: number = 10) {
        const orders = await this.orderRepo.find({
            where: { companyId },
            relations: ['customer'],
            order: { createdAt: 'DESC' },
            take: limit,
        });

        return orders.map((order) => {
            const firstItem = order.items?.[0];
            const productName = firstItem?.product?.name || (firstItem?.productId ? `Product ${firstItem.productId}` : 'N/A');
            const customerName =
                order.customer?.name || order.customerName || 'Guest';
            const orderId = `#${order.id.toString().padStart(6, '0')}`;
            const date = new Date(order.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
            const status =
                order.status.charAt(0).toUpperCase() + order.status.slice(1);

            return {
                product: productName,
                customer: customerName,
                id: orderId,
                date,
                status,
            };
        });
    }

    private async getBestSellingProducts(companyId: string, limit: number = 3) {
        // Get all orders for this company
        const orders = await this.orderRepo.find({
            where: { companyId },
        });

        // Filter only from paid/delivered orders and extract items
        const paidOrders = orders.filter(
            (order) =>
                order.isPaid ||
                order.status === 'paid' ||
                order.status === 'delivered',
        );

        // Group by product and sum quantities
        const productSales = new Map<
            number,
            { name: string; sales: number; id: number }
        >();

        paidOrders.forEach((order) => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach((item) => {
                    if (item.productId) {
                        const existing = productSales.get(item.productId) || {
                            name: item.product?.name || `Product ${item.productId}`,
                            sales: 0,
                            id: item.productId,
                        };
                        existing.sales += item.quantity || 0;
                        productSales.set(item.productId, existing);
                    }
                });
            }
        });

        // Sort by sales and take top N
        const topProducts = Array.from(productSales.values())
            .sort((a, b) => b.sales - a.sales)
            .slice(0, limit)
            .map((product) => ({
                name: product.name,
                sales: product.sales >= 1000 ? `${(product.sales / 1000).toFixed(1)}k+ Sales` : `${product.sales} Sales`,
                id: product.id.toString(),
            }));

        return topProducts;
    }

    private async getTopCustomers(companyId: string, limit: number = 3) {
        // Get all orders for this company
        const orders = await this.orderRepo.find({
            where: { companyId },
            relations: ['customer'],
        });

        // Count orders per customer (only paid/delivered orders)
        const customerOrderCounts = new Map<
            number,
            { name: string; count: number }
        >();

        orders
            .filter(
                (order) =>
                    order.isPaid ||
                    order.status === 'paid' ||
                    order.status === 'delivered',
            )
            .forEach((order) => {
                if (order.customer?.id) {
                    const existing = customerOrderCounts.get(order.customer.id) || {
                        name: order.customer.name,
                        count: 0,
                    };
                    existing.count += 1;
                    customerOrderCounts.set(order.customer.id, existing);
                }
            });

        // Sort by order count and take top N
        const topCustomers = Array.from(customerOrderCounts.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, limit)
            .map((customer) => ({
                name: customer.name,
                orders: `${customer.count} ${customer.count === 1 ? 'Order' : 'Orders'}`,
            }));

        return topCustomers;
    }

    /**
     * Get customer & order stats for dashboard/widgets.
     * Returns: totalCustomers, successOrderRatio, cancelRatio, newCustomerRatio, totalBannedCustomers, etc.
     */
    async getCustomerStats(companyId: string) {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Total customers (users with role customer, or all users in tbl_users for this company)
        const totalCustomers = await this.userRepo.count({
            where: { companyId },
        });

        // New customers (created in last 30 days)
        const newCustomersCount = await this.userRepo.count({
            where: {
                companyId,
                createdAt: Between(thirtyDaysAgo, now),
            },
        });

        // New customer ratio (% of total)
        const newCustomerRatio = totalCustomers > 0
            ? Number(((newCustomersCount / totalCustomers) * 100).toFixed(2))
            : 0;

        // Total banned customers
        const totalBannedCustomers = await this.userRepo.count({
            where: { companyId, isBanned: true },
        });

        // Order stats
        const allOrders = await this.orderRepo.find({
            where: { companyId },
        });

        const totalOrders = allOrders.length;
        const successOrders = allOrders.filter(
            (o) => o.isPaid || o.status === 'paid' || o.status === 'delivered',
        ).length;
        const cancelledOrders = allOrders.filter(
            (o) => (o.status?.toLowerCase() || '') === 'cancelled',
        ).length;
        const refundedOrders = allOrders.filter(
            (o) => (o.status?.toLowerCase() || '') === 'refunded',
        ).length;

        // Success order ratio (% of total orders)
        const successOrderRatio = totalOrders > 0
            ? Number(((successOrders / totalOrders) * 100).toFixed(2))
            : 0;

        // Cancel ratio (% of total orders)
        const cancelRatio = totalOrders > 0
            ? Number(((cancelledOrders / totalOrders) * 100).toFixed(2))
            : 0;

        // Refund ratio
        const refundRatio = totalOrders > 0
            ? Number(((refundedOrders / totalOrders) * 100).toFixed(2))
            : 0;

        return {
            totalCustomers,
            newCustomersCount,
            newCustomerRatio,
            totalBannedCustomers,
            totalOrders,
            successOrders,
            cancelledOrders,
            refundedOrders,
            successOrderRatio,
            cancelRatio,
            refundRatio,
        };
    }

    /**
     * Get category stats for dashboard/widgets.
     * Returns: totalCategories, activeCategories, inactiveCategories, rootCategories, productsWithCategory.
     */
    async getCategoryStats(companyId: string) {
        const allCategories = await this.categoryRepo.find({
            where: { companyId, deletedAt: IsNull() },
            relations: ['parent'],
        });

        const totalCategories = allCategories.length;
        const activeCategories = allCategories.filter((c) => c.isActive).length;
        const inactiveCategories = totalCategories - activeCategories;
        const rootCategories = allCategories.filter((c) => !c.parent).length;

        const productsWithCategory = await this.productRepo.count({
            where: { companyId },
        });

        return {
            totalCategories,
            activeCategories,
            inactiveCategories,
            rootCategories,
            productsWithCategory,
        };
    }

    /**
     * Get product stats for dashboard/widgets.
     * Returns: totalProducts, publishedProducts, draftProducts, trashedProducts, activeProducts, lowStockProducts, outOfStockProducts.
     */
    async getProductStats(companyId: string) {
        const baseWhere = { companyId, deletedAt: IsNull() };

        const [publishedProducts, draftProducts, trashedProducts, activeProducts, lowStockProducts, outOfStockProducts] =
            await Promise.all([
                this.productRepo.count({ where: { ...baseWhere, status: 'published' } }),
                this.productRepo.count({ where: { ...baseWhere, status: 'draft' } }),
                this.productRepo.count({
                    where: { companyId, status: 'trashed' },
                    withDeleted: true,
                }),
                this.productRepo.count({ where: { ...baseWhere, status: 'published', isActive: true } }),
                this.productRepo.count({ where: { ...baseWhere, status: 'published', isLowStock: true } }),
                this.productRepo
                    .createQueryBuilder('p')
                    .where('p.companyId = :companyId', { companyId })
                    .andWhere('p.deletedAt IS NULL')
                    .andWhere('p.status = :status', { status: 'published' })
                    .andWhere('p.stock <= 0')
                    .getCount(),
            ]);

        const totalProducts = publishedProducts + draftProducts + trashedProducts;

        return {
            totalProducts,
            publishedProducts,
            draftProducts,
            trashedProducts,
            activeProducts,
            lowStockProducts,
            outOfStockProducts,
        };
    }

    /**
     * Generate AI-powered daily report for system owner using Groq API (free tier).
     * Summarizes dashboard data into an executive report.
     */
    async getAiDailyReport(companyId: string): Promise<{ report: string; generatedAt: string }> {
        const groqApiKey = process.env.AIDAILYREPORT ?? '';
        if (!groqApiKey) {
            return {
                report: 'AI report is not configured. Please add AIDAILYREPORT to your environment variables. Get a free API key at https://console.groq.com',
                generatedAt: new Date().toISOString(),
            };
        }

        try {
            const dashboardData = await this.getDashboardData(companyId);
            const today = new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            const prompt = `You are an AI business analyst. Generate a concise daily executive report for the e-commerce store owner based on the following dashboard data. Write in a professional, actionable tone. Keep it under 200 words. Focus on key insights, trends, and recommendations.

Date: ${today}

Dashboard Data:
- Stats: ${JSON.stringify(dashboardData.stats)}
- Recent Orders (last 10): ${JSON.stringify(dashboardData.recentOrders)}
- Best Selling Products: ${JSON.stringify(dashboardData.bestSellers)}
- Top Customers: ${JSON.stringify(dashboardData.topCustomers)}
- Revenue Trend (last 7 days): ${JSON.stringify(dashboardData.lineChartData)}
- Payment Status: ${dashboardData.radialChartData[0]?.paid ?? 0}% paid, ${dashboardData.radialChartData[0]?.unpaid ?? 0}% unpaid

Generate a brief daily report with: 1) Executive summary, 2) Key highlights, 3) One actionable recommendation.`;

            const response = await axios.post(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                    model: 'llama-3.1-8b-instant',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful business analyst. Generate concise, professional daily reports for e-commerce store owners.',
                        },
                        { role: 'user', content: prompt },
                    ],
                    max_tokens: 500,
                    temperature: 0.7,
                },
                {
                    headers: {
                        Authorization: `Bearer ${groqApiKey}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 15000,
                },
            );

            const report =
                response.data?.choices?.[0]?.message?.content?.trim() ||
                'Unable to generate report. Please try again.';

            return {
                report,
                generatedAt: new Date().toISOString(),
            };
        } catch (error) {
            const errMsg = error?.response?.data?.error?.message || error?.message || 'Unknown error';
            console.error('AI report generation failed:', errMsg);
            return {
                report: `AI report generation failed: ${errMsg}. Please ensure AIDAILYREPORT is valid. Get a free key at https://console.groq.com`,
                generatedAt: new Date().toISOString(),
            };
        }
    }

    /**
     * Get AI-generated live messages about sales and updates for real-time dashboard feed.
     * Returns short bullet-point messages for ticker/feed display.
     */
    async getAiLiveMessages(companyId: string): Promise<{ messages: Array<{ text: string; type: string; timestamp: string }>; generatedAt: string }> {
        const groqApiKey = process.env.AINESSAGE ?? '';
        if (!groqApiKey) {
            return {
                messages: [{ text: 'AI messages require AINESSAGE in your environment. Get a free key at console.groq.com', type: 'info', timestamp: new Date().toISOString() }],
                generatedAt: new Date().toISOString(),
            };
        }

        try {
            const dashboardData = await this.getDashboardData(companyId);
            const recentOrders = dashboardData.recentOrders || [];
            const bestSellers = dashboardData.bestSellers || [];
            const stats = dashboardData.stats || [];

            const prompt = `Based on this e-commerce dashboard data, generate exactly 4-5 SHORT bullet-point messages (each under 15 words) for a live feed. Mix: 1) Sales insights (revenue, orders), 2) Top products/customers, 3) Action items. Format as JSON array: [{"text":"message","type":"sales|insight|action"}]. Example: [{"text":"3 new orders today - $120 revenue","type":"sales"},{"text":"Product X is top seller","type":"insight"}]. Return ONLY valid JSON array, no other text.

Stats: ${JSON.stringify(stats)}
Recent orders: ${JSON.stringify(recentOrders.slice(0, 5))}
Best sellers: ${JSON.stringify(bestSellers)}`;

            const response = await axios.post(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                    model: 'llama-3.1-8b-instant',
                    messages: [
                        { role: 'system', content: 'You output only valid JSON arrays. No markdown, no explanation.' },
                        { role: 'user', content: prompt },
                    ],
                    max_tokens: 400,
                    temperature: 0.5,
                },
                {
                    headers: {
                        Authorization: `Bearer ${groqApiKey}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 12000,
                },
            );

            const content = response.data?.choices?.[0]?.message?.content?.trim() || '[]';
            let parsed: Array<{ text?: string; type?: string }> = [];
            try {
                const cleaned = content.replace(/```json?\s*/g, '').replace(/```\s*/g, '').trim();
                parsed = JSON.parse(cleaned);
            } catch {
                parsed = [{ text: content || 'No messages available', type: 'info' }];
            }

            const messages = (Array.isArray(parsed) ? parsed : []).slice(0, 6).map((m) => ({
                text: m.text || 'Update',
                type: m.type || 'info',
                timestamp: new Date().toISOString(),
            }));

            return {
                messages: messages.length ? messages : [{ text: 'No updates at the moment. Check back soon.', type: 'info', timestamp: new Date().toISOString() }],
                generatedAt: new Date().toISOString(),
            };
        } catch (error) {
            const errMsg = error?.response?.data?.error?.message || error?.message || 'Unknown error';
            console.error('AI live messages failed:', errMsg);
            return {
                messages: [{ text: `AI messages unavailable: ${errMsg}`, type: 'info', timestamp: new Date().toISOString() }],
                generatedAt: new Date().toISOString(),
            };
        }
    }

    /**ggggg
     * Get AI sales-based direction to help the store owner.
     * Returns actionable recommendations based on sales data.
     */
    async getAiSalesDirection(companyId: string): Promise<{
        directions: Array<{ title: string; action: string; priority: string }>;
        generatedAt: string;
    }> {
        const groqApiKey = process.env.AISALE ?? '';
        if (!groqApiKey) {
            return {
                directions: [{ title: 'Configure AI', action: 'Add AISALE to your environment to enable sales direction. Get free key at console.groq.com', priority: 'info' }],
                generatedAt: new Date().toISOString(),
            };
        }

        try {
            const dashboardData = await this.getDashboardData(companyId);
            const productStats = await this.getProductStats(companyId);
            const customerStats = await this.getCustomerStats(companyId);
            const stats = dashboardData.stats || [];
            const bestSellers = dashboardData.bestSellers || [];
            const topCustomers = dashboardData.topCustomers || [];
            const recentOrders = dashboardData.recentOrders || [];

            const prompt = `You are a sales advisor for an e-commerce store owner. Based on this data, give 4-5 SHORT actionable directions to help the owner. Focus on: 1) What to promote/restock, 2) Customer actions, 3) Inventory alerts, 4) Revenue opportunities. Format as JSON array: [{"title":"short label","action":"what owner should do","priority":"high|medium|low"}]. Example: [{"title":"Restock Alert","action":"Product X is top seller - consider restocking soon","priority":"high"}]. Return ONLY valid JSON array.

Stats: ${JSON.stringify(stats)}
Best sellers: ${JSON.stringify(bestSellers)}
Top customers: ${JSON.stringify(topCustomers)}
Product stats (low/out of stock): ${JSON.stringify({ lowStock: productStats.lowStockProducts, outOfStock: productStats.outOfStockProducts })}
Recent orders: ${JSON.stringify(recentOrders.slice(0, 3))}`;

            const response = await axios.post(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                    model: 'llama-3.1-8b-instant',
                    messages: [
                        { role: 'system', content: 'You output only valid JSON arrays. Be practical and actionable for store owners.' },
                        { role: 'user', content: prompt },
                    ],
                    max_tokens: 500,
                    temperature: 0.5,
                },
                {
                    headers: {
                        Authorization: `Bearer ${groqApiKey}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 12000,
                },
            );

            const content = response.data?.choices?.[0]?.message?.content?.trim() || '[]';
            let parsed: Array<{ title?: string; action?: string; priority?: string }> = [];
            try {
                const cleaned = content.replace(/```json?\s*/g, '').replace(/```\s*/g, '').trim();
                parsed = JSON.parse(cleaned);
            } catch {
                parsed = [{ title: 'Tip', action: content || 'Review your dashboard for insights', priority: 'medium' }];
            }

            const directions = (Array.isArray(parsed) ? parsed : []).slice(0, 5).map((d) => ({
                title: d.title || 'Action',
                action: d.action || 'Check your store',
                priority: d.priority || 'medium',
            }));

            return {
                directions: directions.length ? directions : [{ title: 'Stay active', action: 'Monitor your dashboard and respond to new orders promptly', priority: 'medium' }],
                generatedAt: new Date().toISOString(),
            };
        } catch (error) {
            const errMsg = error?.response?.data?.error?.message || error?.message || 'Unknown error';
            console.error('AI sales direction failed:', errMsg);
            return {
                directions: [{ title: 'AI unavailable', action: `Sales direction unavailable. ${errMsg}`, priority: 'low' }],
                generatedAt: new Date().toISOString(),
            };
        }
    }

    /**
     * Generate AI-powered description suggestion for forms (product, promocode, package, etc.).
     * Uses Groq API with context (e.g. product name, code) to suggest a relevant description.
     */
    async suggestAiDescription(
        companyId: string,
        body: { context?: string; type?: string; title?: string; lang?: string },
    ): Promise<{ suggestion: string; generatedAt: string }> {
        const groqApiKey = process.env.GROQ_API_KEY ?? process.env.AISALE ?? '';
        if (!groqApiKey) {
            return {
                suggestion: '',
                generatedAt: new Date().toISOString(),
            };
        }

        const { context = '', type = 'general', title = '', lang = 'en' } = body;

        const typePrompts: Record<string, string> = {
            product: 'Generate a concise, compelling product description for an e-commerce listing. Include key features, benefits, and call-to-action. Keep it under 200 words.',
            promocode: 'Generate a short, clear description for a promo/discount code. Explain what the offer is and who it applies to. Keep it under 100 words.',
            package: 'Generate a professional package/plan description for a subscription or service tier. Highlight features and value. Keep it under 150 words.',
            general: 'Generate a clear, professional description based on the context. Keep it concise and under 150 words.',
        };
        const typePrompt = typePrompts[type] || typePrompts.general;

        const langInstructions: Record<string, string> = {
            en: 'Write the description in English.',
            bn: 'Write the description in Bengali (Bangla script). Use proper Bengali/Bangla script (বাংলা লিপি).',
            'bn-Latn': 'Write the description in Minglish (Bengali/Bangla written in English/Latin letters, e.g. "ami bhat khabo" instead of "আমি ভাত খাবো").',
        };
        const langInstruction = langInstructions[lang] || langInstructions.en;

        const prompt = `You are an e-commerce copywriter. ${typePrompt} ${langInstruction}

${title ? `Title/Name: ${title}` : ''}
${context ? `Context: ${context}` : ''}

Return ONLY the description text, no quotes or extra formatting.`;

        try {
            const response = await axios.post(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                    model: 'llama-3.1-8b-instant',
                    messages: [
                        {
                            role: 'system',
                            content: 'You generate concise, professional descriptions for e-commerce. Return only the description text.',
                        },
                        { role: 'user', content: prompt },
                    ],
                    max_tokens: 400,
                    temperature: 0.7,
                },
                {
                    headers: {
                        Authorization: `Bearer ${groqApiKey}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 15000,
                },
            );

            const suggestion =
                response.data?.choices?.[0]?.message?.content?.trim() || '';

            return {
                suggestion,
                generatedAt: new Date().toISOString(),
            };
        } catch (error) {
            const errMsg = error?.response?.data?.error?.message || error?.message || 'Unknown error';
            console.error('AI description suggestion failed:', errMsg);
            return {
                suggestion: '',
                generatedAt: new Date().toISOString(),
            };
        }
    }

    /**
     * Translate report text to Bengali, Minglish (bn-Latn), or English using Groq API.
     */
    async translateReport(
        companyId: string,
        body: { text?: string; targetLang?: string },
    ): Promise<{ translatedText: string; generatedAt: string }> {
        const groqApiKey = process.env.GROQ_API_KEY ?? process.env.AISALE ?? '';
        const { text = '', targetLang = 'en' } = body;

        if (!text?.trim()) {
            return { translatedText: text, generatedAt: new Date().toISOString() };
        }

        if (!groqApiKey) {
            return {
                translatedText: text,
                generatedAt: new Date().toISOString(),
            };
        }

        const langInstructions: Record<string, string> = {
            bn: 'Translate the following English text to Bengali (Bangla script). Return ONLY the translated text, no explanation.',
            'bn-Latn': 'Translate the following text to Minglish (Bengali written in Latin/English letters). Return ONLY the translated text, no explanation.',
            minglish: 'Translate the following text to Minglish (Bengali written in Latin/English letters). Return ONLY the translated text, no explanation.',
            en: 'Translate the following text to English. Return ONLY the translated text, no explanation.',
        };
        const instruction = langInstructions[targetLang] || langInstructions.en;

        try {
            const response = await axios.post(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                    model: 'llama-3.1-8b-instant',
                    messages: [
                        { role: 'system', content: 'You are a translator. Return only the translated text, nothing else.' },
                        { role: 'user', content: `${instruction}\n\n${text}` },
                    ],
                    max_tokens: 1000,
                    temperature: 0.3,
                },
                {
                    headers: {
                        Authorization: `Bearer ${groqApiKey}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 15000,
                },
            );

            const translatedText =
                response.data?.choices?.[0]?.message?.content?.trim() || text;

            return {
                translatedText,
                generatedAt: new Date().toISOString(),
            };
        } catch (error) {
            const errMsg = error?.response?.data?.error?.message || error?.message || 'Unknown error';
            console.error('Report translation failed:', errMsg);
            return {
                translatedText: text,
                generatedAt: new Date().toISOString(),
            };
        }
    }
}


