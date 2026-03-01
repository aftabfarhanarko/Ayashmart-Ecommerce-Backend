import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboard(companyId: string): Promise<{
        statusCode: number;
        message: string;
        data: {
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
        };
    }>;
    getStats(companyId: string): Promise<{
        statusCode: number;
        message: string;
        data: {
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
        };
    }>;
    getCategoryStats(companyId: string): Promise<{
        statusCode: number;
        message: string;
        data: {
            totalCategories: number;
            activeCategories: number;
            inactiveCategories: number;
            rootCategories: number;
            productsWithCategory: number;
        };
    }>;
    getAiDailyReport(companyId: string): Promise<{
        statusCode: number;
        message: string;
        data: {
            report: string;
            generatedAt: string;
        };
    }>;
    translateReport(companyId: string, body: {
        text?: string;
        targetLang?: string;
    }): Promise<{
        statusCode: number;
        message: string;
        data: {
            translatedText: string;
            generatedAt: string;
        };
    }>;
    getAiLiveMessages(companyId: string): Promise<{
        statusCode: number;
        message: string;
        data: {
            messages: Array<{
                text: string;
                type: string;
                timestamp: string;
            }>;
            generatedAt: string;
        };
    }>;
    getAiSalesDirection(companyId: string): Promise<{
        statusCode: number;
        message: string;
        data: {
            directions: Array<{
                title: string;
                action: string;
                priority: string;
            }>;
            generatedAt: string;
        };
    }>;
    suggestDescription(companyId: string, body: {
        context?: string;
        type?: string;
        title?: string;
        lang?: string;
    }): Promise<{
        statusCode: number;
        message: string;
        data: {
            suggestion: string;
            generatedAt: string;
        };
    }>;
    getStatistics(companyId: string): Promise<{
        statusCode: number;
        message: string;
        data: {
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
        };
    }>;
}
