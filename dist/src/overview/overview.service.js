"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverviewService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const systemuser_entity_1 = require("../systemuser/entities/systemuser.entity");
const user_entity_1 = require("../users/entities/user.entity");
const help_entity_1 = require("../help/entities/help.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const invoice_entity_1 = require("../invoice/entities/invoice.entity");
let OverviewService = class OverviewService {
    constructor(systemUserRepo, userRepo, helpRepo, orderRepo, invoiceRepo) {
        this.systemUserRepo = systemUserRepo;
        this.userRepo = userRepo;
        this.helpRepo = helpRepo;
        this.orderRepo = orderRepo;
        this.invoiceRepo = invoiceRepo;
    }
    async getOverview() {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        const todayStart = new Date(now.setHours(0, 0, 0, 0));
        const currentYear = now.getFullYear();
        const yearStart = new Date(currentYear, 0, 1);
        const yearInvoices = await this.invoiceRepo.find({
            where: {
                deletedAt: (0, typeorm_2.IsNull)(),
                createdAt: (0, typeorm_2.MoreThan)(yearStart),
            },
        });
        const totalEarningsYTD = yearInvoices
            .filter((invoice) => invoice.status === invoice_entity_1.InvoiceStatus.PAID)
            .reduce((sum, invoice) => sum + Number(invoice.paidAmount || 0), 0);
        const previousYearStart = new Date(currentYear - 1, 0, 1);
        const previousYearEnd = new Date(currentYear - 1, 11, 31, 23, 59, 59);
        const previousYearInvoices = await this.invoiceRepo.find({
            where: {
                deletedAt: (0, typeorm_2.IsNull)(),
            },
        });
        const previousYearEarnings = previousYearInvoices
            .filter((invoice) => invoice.status === invoice_entity_1.InvoiceStatus.PAID &&
            invoice.createdAt >= previousYearStart &&
            invoice.createdAt <= previousYearEnd)
            .reduce((sum, invoice) => sum + Number(invoice.paidAmount || 0), 0);
        const earningsDelta = previousYearEarnings > 0
            ? ((totalEarningsYTD - previousYearEarnings) / previousYearEarnings) * 100
            : totalEarningsYTD > 0
                ? 100
                : 0;
        const activeCustomers = await this.userRepo.count({
            where: {
                deletedAt: (0, typeorm_2.IsNull)(),
                createdAt: (0, typeorm_2.MoreThan)(ninetyDaysAgo),
                successfulOrdersCount: (0, typeorm_2.MoreThan)(0),
            },
        });
        const previousPeriodStart = new Date(ninetyDaysAgo.getTime() - 90 * 24 * 60 * 60 * 1000);
        const previousPeriodEnd = new Date(ninetyDaysAgo);
        const previousActiveCustomers = await this.userRepo.count({
            where: {
                deletedAt: (0, typeorm_2.IsNull)(),
                createdAt: (0, typeorm_2.MoreThan)(previousPeriodStart),
                successfulOrdersCount: (0, typeorm_2.MoreThan)(0),
            },
        });
        const customersDelta = previousActiveCustomers > 0
            ? ((activeCustomers - previousActiveCustomers) / previousActiveCustomers) * 100
            : activeCustomers > 0
                ? 100
                : 0;
        const openTickets = await this.helpRepo.count({
            where: {
                deletedAt: (0, typeorm_2.IsNull)(),
                status: help_entity_1.SupportStatus.PENDING,
            },
        });
        const previousOpenTickets = openTickets;
        const ticketsDelta = previousOpenTickets > 0
            ? ((openTickets - previousOpenTickets) / previousOpenTickets) * 100
            : openTickets > 0
                ? 100
                : 0;
        const newCustomersLast7Days = await this.userRepo.count({
            where: {
                deletedAt: (0, typeorm_2.IsNull)(),
                createdAt: (0, typeorm_2.MoreThan)(sevenDaysAgo),
            },
        });
        const totalCustomers = await this.userRepo.count({
            where: { deletedAt: (0, typeorm_2.IsNull)() },
        });
        const customersWithOrders = await this.userRepo.count({
            where: {
                deletedAt: (0, typeorm_2.IsNull)(),
                successfulOrdersCount: (0, typeorm_2.MoreThan)(0),
            },
        });
        const returningCustomersPercentage = totalCustomers > 0 ? (customersWithOrders / totalCustomers) * 100 : 0;
        const atRiskCustomers = await this.userRepo.count({
            where: {
                deletedAt: (0, typeorm_2.IsNull)(),
                createdAt: (0, typeorm_2.MoreThan)(ninetyDaysAgo),
                successfulOrdersCount: 0,
            },
        });
        const newTicketsToday = await this.helpRepo.count({
            where: {
                deletedAt: (0, typeorm_2.IsNull)(),
                createdAt: (0, typeorm_2.MoreThan)(todayStart),
            },
        });
        const waitingForReply = await this.helpRepo.count({
            where: {
                deletedAt: (0, typeorm_2.IsNull)(),
                status: help_entity_1.SupportStatus.PENDING,
            },
        });
        const averageResponseTime = '12 min';
        const allInvoices = await this.invoiceRepo.find({
            where: { deletedAt: (0, typeorm_2.IsNull)() },
        });
        const totalInvoices = allInvoices.length;
        const paidInvoices = allInvoices.filter(inv => inv.status === invoice_entity_1.InvoiceStatus.PAID).length;
        const pendingInvoices = allInvoices.filter(inv => inv.status === invoice_entity_1.InvoiceStatus.PENDING).length;
        const cancelledInvoices = allInvoices.filter(inv => inv.status === invoice_entity_1.InvoiceStatus.CANCELLED).length;
        const failedInvoices = allInvoices.filter(inv => inv.status === invoice_entity_1.InvoiceStatus.FAILED).length;
        const newInvoicesLast7Days = allInvoices.filter(inv => inv.createdAt >= sevenDaysAgo).length;
        const totalPaidAmount = allInvoices
            .filter(inv => inv.status === invoice_entity_1.InvoiceStatus.PAID)
            .reduce((sum, inv) => sum + Number(inv.paidAmount || 0), 0);
        const totalPendingAmount = allInvoices
            .filter(inv => inv.status === invoice_entity_1.InvoiceStatus.PENDING)
            .reduce((sum, inv) => sum + Number(inv.dueAmount || 0), 0);
        return {
            kpis: {
                totalEarnings: totalEarningsYTD,
                totalEarningsDelta: earningsDelta,
                activeCustomers: activeCustomers,
                activeCustomersDelta: customersDelta,
                openSupportTickets: openTickets,
                openSupportTicketsDelta: ticketsDelta,
            },
            customers: {
                newCustomersLast7Days: newCustomersLast7Days,
                returningCustomersPercentage: returningCustomersPercentage,
                atRiskCustomers: atRiskCustomers,
            },
            support: {
                newTicketsToday: newTicketsToday,
                waitingForReply: waitingForReply,
                averageResponseTime: averageResponseTime,
            },
            invoices: {
                totalInvoices: totalInvoices,
                paidInvoices: paidInvoices,
                pendingInvoices: pendingInvoices,
                cancelledInvoices: cancelledInvoices,
                failedInvoices: failedInvoices,
                newInvoicesLast7Days: newInvoicesLast7Days,
                totalPaidAmount: totalPaidAmount,
                totalPendingAmount: totalPendingAmount,
                paidPercentage: totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0,
            },
        };
    }
};
exports.OverviewService = OverviewService;
exports.OverviewService = OverviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(systemuser_entity_1.SystemUser)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(help_entity_1.Help)),
    __param(3, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(4, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OverviewService);
//# sourceMappingURL=overview.service.js.map