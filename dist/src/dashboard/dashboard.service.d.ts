import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { CashService } from '../cash/cash.service';
export declare class DashboardService {
    private orderRepo;
    private userRepo;
    private productRepo;
    private categoryRepo;
    private cashService;
    constructor(orderRepo: Repository<Order>, userRepo: Repository<User>, productRepo: Repository<ProductEntity>, categoryRepo: Repository<CategoryEntity>, cashService: CashService);
    getDashboardData(companyId: string): Promise<{
        stats: {
            title: string;
            value: string;
            delta: string;
            tone: string;
        }[];
        lineChartData: {
            month: string;
            totalPNL: number;
        }[];
        radialChartData: {
            paid: number;
            unpaid: number;
        }[];
        recentOrders: {
            product: string;
            customer: string;
            id: string;
            date: string;
            status: string;
        }[];
        bestSellers: {
            name: string;
            sales: string;
            id: string;
        }[];
        topCustomers: {
            name: string;
            orders: string;
        }[];
        productStats: {
            totalProducts: number;
            publishedProducts: number;
            draftProducts: number;
            trashedProducts: number;
            activeProducts: number;
            lowStockProducts: number;
            outOfStockProducts: number;
        };
        overviewMetrics: {
            totalProducts: number;
            totalSales: number;
            totalRevenue: number;
            totalStoreViews: number;
        };
        recentProducts: {
            id: number;
            name: string;
            category: string;
            price: string;
            stock: number;
        }[];
        salesOverview: {
            daily: {
                name: string;
                totalPNL: number;
            }[];
            weekly: {
                name: string;
                totalPNL: number;
            }[];
            monthly: {
                name: string;
                totalPNL: number;
            }[];
            yearly: {
                name: string;
                totalPNL: number;
            }[];
        };
        subscriberChart: {
            daily: {
                name: string;
                value: number;
            }[];
            weekly: {
                name: string;
                value: number;
            }[];
            monthly: {
                name: string;
                value: number;
            }[];
            yearly: {
                name: string;
                value: number;
            }[];
        };
        recentTransactions: {
            id: number;
            name: string;
            inv: string;
            amount: string;
            type: string;
            icon: string;
            date: string;
        }[];
        recentCustomers: {
            id: number;
            user: string;
            ip: string;
            time: string;
        }[];
        salesDistribution: {
            name: string;
            value: number;
            color: string;
        }[];
        integrations: {
            id: number;
            name: string;
            type: string;
            rate: string;
            profit: string;
        }[];
    }>;
    private calculateStats;
    private getLineChartData;
    private getRadialChartData;
    private getRecentProducts;
    private getSalesOverviewByPeriod;
    private generatePeriodLabels;
    private getSubscriberChartByPeriod;
    private getRecentTransactions;
    private getRecentCustomers;
    private getSalesDistribution;
    getStatistics(companyId: string): Promise<{
        chartData: {
            name: string;
            earning: number;
            sells: number;
            visit: number;
        }[];
        countryStats: {
            country: string;
            users: string;
            flag: string;
        }[];
        paymentData: {
            id: number;
            name: string;
            email: string;
            contact: string;
            product: string;
            amount: string;
            avatar: string;
        }[];
    }>;
    private getRecentOrders;
    private getBestSellingProducts;
    private getTopCustomers;
    getCustomerStats(companyId: string): Promise<{
        totalCustomers: number;
        newCustomersCount: number;
        newCustomerRatio: number;
        totalBannedCustomers: number;
        totalOrders: number;
        successOrders: number;
        cancelledOrders: number;
        refundedOrders: number;
        successOrderRatio: number;
        cancelRatio: number;
        refundRatio: number;
    }>;
    getCategoryStats(companyId: string): Promise<{
        totalCategories: number;
        activeCategories: number;
        inactiveCategories: number;
        rootCategories: number;
        productsWithCategory: number;
    }>;
    getProductStats(companyId: string): Promise<{
        totalProducts: number;
        publishedProducts: number;
        draftProducts: number;
        trashedProducts: number;
        activeProducts: number;
        lowStockProducts: number;
        outOfStockProducts: number;
    }>;
    getAiDailyReport(companyId: string): Promise<{
        report: string;
        generatedAt: string;
    }>;
    getAiLiveMessages(companyId: string): Promise<{
        messages: Array<{
            text: string;
            type: string;
            timestamp: string;
        }>;
        generatedAt: string;
    }>;
    getAiSalesDirection(companyId: string): Promise<{
        directions: Array<{
            title: string;
            action: string;
            priority: string;
        }>;
        generatedAt: string;
    }>;
    suggestAiDescription(companyId: string, body: {
        context?: string;
        type?: string;
        title?: string;
        lang?: string;
    }): Promise<{
        suggestion: string;
        generatedAt: string;
    }>;
    translateReport(companyId: string, body: {
        text?: string;
        targetLang?: string;
    }): Promise<{
        translatedText: string;
        generatedAt: string;
    }>;
}
