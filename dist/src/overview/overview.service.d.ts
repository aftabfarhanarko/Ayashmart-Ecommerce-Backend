import { Repository } from 'typeorm';
import { SystemUser } from '../systemuser/entities/systemuser.entity';
import { User } from '../users/entities/user.entity';
import { Help } from '../help/entities/help.entity';
import { Order } from '../orders/entities/order.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
export declare class OverviewService {
    private readonly systemUserRepo;
    private readonly userRepo;
    private readonly helpRepo;
    private readonly orderRepo;
    private readonly invoiceRepo;
    constructor(systemUserRepo: Repository<SystemUser>, userRepo: Repository<User>, helpRepo: Repository<Help>, orderRepo: Repository<Order>, invoiceRepo: Repository<Invoice>);
    getOverview(): Promise<{
        kpis: {
            totalEarnings: number;
            totalEarningsDelta: number;
            activeCustomers: number;
            activeCustomersDelta: number;
            openSupportTickets: number;
            openSupportTicketsDelta: number;
        };
        customers: {
            newCustomersLast7Days: number;
            returningCustomersPercentage: number;
            atRiskCustomers: number;
        };
        support: {
            newTicketsToday: number;
            waitingForReply: number;
            averageResponseTime: string;
        };
        invoices: {
            totalInvoices: number;
            paidInvoices: number;
            pendingInvoices: number;
            cancelledInvoices: number;
            failedInvoices: number;
            newInvoicesLast7Days: number;
            totalPaidAmount: number;
            totalPendingAmount: number;
            paidPercentage: number;
        };
    }>;
}
