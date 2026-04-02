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
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bank_payment_dto_1 = require("./dto/bank-payment.dto");
const invoice_entity_1 = require("./entities/invoice.entity");
const systemuser_entity_1 = require("../systemuser/entities/systemuser.entity");
const config_1 = require("@nestjs/config");
const systemuser_service_1 = require("../systemuser/systemuser.service");
const templates_1 = require("../common/templates");
let InvoiceService = class InvoiceService {
    constructor(invoiceRepository, systemUserRepository, configService, mailerTransport, systemuserService) {
        this.invoiceRepository = invoiceRepository;
        this.systemUserRepository = systemUserRepository;
        this.configService = configService;
        this.mailerTransport = mailerTransport;
        this.systemuserService = systemuserService;
        this.bkashAppKey = this.configService.get('BKASH_APP_KEY') || '';
        this.bkashAppSecret = this.configService.get('BKASH_APP_SECRET') || '';
        this.bkashUsername = this.configService.get('BKASH_USERNAME') || '';
        this.bkashPassword = this.configService.get('BKASH_PASSWORD') || '';
        this.bkashBaseURL = this.configService.get('BKASH_BASE_URL') || 'https://checkout.sandbox.bka.sh/v1.2.0-beta';
        this.bkashGrantTokenURL = `${this.bkashBaseURL}/checkout/token/grant`;
        this.bkashCreatePaymentURL = `${this.bkashBaseURL}/checkout/payment/create`;
        this.bkashExecutePaymentURL = `${this.bkashBaseURL}/checkout/payment/execute`;
    }
    async create(createInvoiceDto) {
        const customer = await this.systemUserRepository.findOne({
            where: { id: createInvoiceDto.customerId },
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${createInvoiceDto.customerId} not found`);
        }
        const invoiceNumber = await this.generateInvoiceNumber();
        const transactionId = this.generateTransactionId();
        const paidAmount = parseFloat(String(createInvoiceDto.paidAmount || 0));
        const dueAmount = parseFloat(String(createInvoiceDto.totalAmount)) - paidAmount;
        let status = createInvoiceDto.status || invoice_entity_1.InvoiceStatus.PENDING;
        if (paidAmount >= createInvoiceDto.totalAmount) {
            status = invoice_entity_1.InvoiceStatus.PAID;
        }
        const invoice = this.invoiceRepository.create({
            ...createInvoiceDto,
            invoiceNumber,
            transactionId,
            dueAmount,
            status,
        });
        const savedInvoice = await this.invoiceRepository.save(invoice);
        if (savedInvoice.status === invoice_entity_1.InvoiceStatus.PAID) {
            await this.handleInvoicePaid(savedInvoice);
        }
        try {
            const adminEmail = this.configService.get('ADMIN_EMAIL') || 'admin@gmail.com';
            const emailHtml = (0, templates_1.generateNewInvoiceAdminNotification)(customer.name, customer.email, savedInvoice.invoiceNumber, savedInvoice.transactionId, savedInvoice.totalAmount, savedInvoice.amountType, new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }), customer.companyName || '');
            await this.mailerTransport.sendMail({
                companyId: customer.companyId,
                to: adminEmail,
                subject: `New Invoice Created - ${savedInvoice.invoiceNumber}`,
                html: emailHtml,
            });
        }
        catch (emailError) {
            console.error('Failed to send admin notification email:', emailError);
        }
        return savedInvoice;
    }
    async findAll() {
        return await this.invoiceRepository.find({
            relations: ['customer'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const invoice = await this.invoiceRepository.findOne({
            where: { id },
            relations: ['customer'],
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice with ID ${id} not found`);
        }
        return invoice;
    }
    async findByCustomer(customerId) {
        return await this.invoiceRepository.find({
            where: { customerId },
            relations: ['customer'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByInvoiceNumber(invoiceNumber) {
        const invoice = await this.invoiceRepository.findOne({
            where: { invoiceNumber },
            relations: ['customer'],
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice with number ${invoiceNumber} not found`);
        }
        return invoice;
    }
    async update(id, updateInvoiceDto) {
        const invoice = await this.findOne(id);
        if (updateInvoiceDto.customerId && updateInvoiceDto.customerId !== invoice.customerId) {
            const customer = await this.systemUserRepository.findOne({
                where: { id: updateInvoiceDto.customerId },
            });
            if (!customer) {
                throw new common_1.NotFoundException(`Customer with ID ${updateInvoiceDto.customerId} not found`);
            }
        }
        const totalAmount = parseFloat(String(updateInvoiceDto.totalAmount ?? invoice.totalAmount));
        const paidAmount = parseFloat(String(updateInvoiceDto.paidAmount ?? invoice.paidAmount));
        const dueAmount = totalAmount - paidAmount;
        let status = updateInvoiceDto.status || invoice.status;
        if (paidAmount >= totalAmount && status === invoice_entity_1.InvoiceStatus.PENDING) {
            status = invoice_entity_1.InvoiceStatus.PAID;
        }
        Object.assign(invoice, {
            ...updateInvoiceDto,
            dueAmount,
            status,
        });
        const savedInvoice = await this.invoiceRepository.save(invoice);
        return savedInvoice;
    }
    async getBkashToken() {
        try {
            const response = await fetch(this.bkashGrantTokenURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    username: this.bkashUsername,
                    password: this.bkashPassword,
                },
                body: JSON.stringify({
                    app_key: this.bkashAppKey,
                    app_secret: this.bkashAppSecret,
                }),
            });
            const data = await response.json();
            if (!data.id_token) {
                throw new common_1.BadRequestException('Failed to get bKash token');
            }
            return data.id_token;
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to authenticate with bKash');
        }
    }
    async initiateBkashPayment(initiatePaymentDto) {
        const invoice = await this.findOne(initiatePaymentDto.invoiceId);
        if (invoice.status === invoice_entity_1.InvoiceStatus.PAID) {
            throw new common_1.BadRequestException('Invoice is already paid');
        }
        if (invoice.status === invoice_entity_1.InvoiceStatus.CANCELLED) {
            throw new common_1.BadRequestException('Invoice is cancelled');
        }
        const token = await this.getBkashToken();
        const callbackURL = initiatePaymentDto.callbackURL ||
            `${this.configService.get('APP_URL')}/api/invoice/bkash/callback`;
        try {
            const response = await fetch(this.bkashCreatePaymentURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: token,
                    'x-app-key': this.bkashAppKey,
                },
                body: JSON.stringify({
                    mode: '0011',
                    payerReference: invoice.invoiceNumber,
                    callbackURL,
                    amount: invoice.dueAmount.toString(),
                    currency: 'BDT',
                    intent: 'sale',
                    merchantInvoiceNumber: invoice.invoiceNumber,
                }),
            });
            const data = await response.json();
            if (!data.paymentID || !data.bkashURL) {
                throw new common_1.BadRequestException('Failed to create bKash payment');
            }
            invoice.bkashPaymentID = data.paymentID;
            await this.invoiceRepository.save(invoice);
            return {
                success: true,
                invoice,
                paymentID: data.paymentID,
                bkashURL: data.bkashURL,
                message: 'bKash payment initiated successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to initiate bKash payment');
        }
    }
    async executeBkashPayment(paymentID) {
        const invoice = await this.invoiceRepository.findOne({
            where: { bkashPaymentID: paymentID },
            relations: ['customer'],
        });
        if (!invoice) {
            throw new common_1.NotFoundException('Invoice not found for this payment');
        }
        const token = await this.getBkashToken();
        try {
            const response = await fetch(this.bkashExecutePaymentURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: token,
                    'x-app-key': this.bkashAppKey,
                },
                body: JSON.stringify({
                    paymentID,
                }),
            });
            const data = await response.json();
            if (data.transactionStatus !== 'Completed') {
                invoice.status = invoice_entity_1.InvoiceStatus.FAILED;
                await this.invoiceRepository.save(invoice);
                throw new common_1.BadRequestException('bKash payment failed or incomplete');
            }
            const paidAmount = parseFloat(data.amount) || 0;
            const newTotalPaidAmount = parseFloat(String(invoice.paidAmount)) + paidAmount;
            const dueAmount = parseFloat(String(invoice.totalAmount)) - newTotalPaidAmount;
            invoice.paidAmount = newTotalPaidAmount;
            invoice.dueAmount = dueAmount < 0 ? 0 : dueAmount;
            invoice.status = newTotalPaidAmount >= invoice.totalAmount ? invoice_entity_1.InvoiceStatus.PAID : invoice_entity_1.InvoiceStatus.PENDING;
            invoice.bkashTrxID = data.trxID;
            const savedInvoice = await this.invoiceRepository.save(invoice);
            if (savedInvoice.status === invoice_entity_1.InvoiceStatus.PAID) {
                await this.handleInvoicePaid(savedInvoice);
            }
            return savedInvoice;
        }
        catch (error) {
            invoice.status = invoice_entity_1.InvoiceStatus.FAILED;
            await this.invoiceRepository.save(invoice);
            throw new common_1.BadRequestException('Failed to execute bKash payment');
        }
    }
    async processBkashCallback(bkashCallbackDto) {
        const { paymentID, status } = bkashCallbackDto;
        if (status === 'success') {
            return await this.executeBkashPayment(paymentID);
        }
        else {
            const invoice = await this.invoiceRepository.findOne({
                where: { bkashPaymentID: paymentID },
            });
            if (invoice) {
                invoice.status = invoice_entity_1.InvoiceStatus.FAILED;
                await this.invoiceRepository.save(invoice);
            }
            throw new common_1.BadRequestException('bKash payment was not successful');
        }
    }
    async processBankPayment(bankPaymentDto) {
        const invoice = await this.findOne(bankPaymentDto.invoiceId);
        if (invoice.status === invoice_entity_1.InvoiceStatus.PAID) {
            throw new common_1.BadRequestException('Invoice is already fully paid');
        }
        if (invoice.status === invoice_entity_1.InvoiceStatus.CANCELLED) {
            throw new common_1.BadRequestException('Cannot process payment for cancelled invoice');
        }
        if (invoice.totalAmount <= 0) {
            throw new common_1.BadRequestException('Amount must be greater than 0');
        }
        invoice.bankPayment = {
            bankName: bankPaymentDto.bankName,
            amount: invoice.totalAmount,
            accLastDigit: bankPaymentDto.accLastDigit,
            status: bankPaymentDto.status || bank_payment_dto_1.BankPaymentStatus.PENDING,
        };
        if (bankPaymentDto.status === bank_payment_dto_1.BankPaymentStatus.VERIFIED) {
            const newTotalPaidAmount = parseFloat(String(invoice.paidAmount)) + parseFloat(String(invoice.totalAmount));
            const dueAmount = parseFloat(String(invoice.totalAmount)) - newTotalPaidAmount;
            invoice.paidAmount = newTotalPaidAmount;
            invoice.dueAmount = dueAmount < 0 ? 0 : dueAmount;
            invoice.status = newTotalPaidAmount >= invoice.totalAmount ? invoice_entity_1.InvoiceStatus.PAID : invoice_entity_1.InvoiceStatus.PENDING;
        }
        const savedInvoice = await this.invoiceRepository.save(invoice);
        if (savedInvoice.status === invoice_entity_1.InvoiceStatus.PAID) {
            await this.handleInvoicePaid(savedInvoice);
        }
        try {
            const customer = invoice.customer;
            const adminEmail = this.configService.get('ADMIN_EMAIL') || 'admin@gmail.com';
            const emailHtml = (0, templates_1.generateBankPaymentAdminNotification)(customer.name, customer.email, invoice.invoiceNumber, invoice.transactionId, invoice.totalAmount, bankPaymentDto.bankName, invoice.totalAmount, bankPaymentDto.accLastDigit, new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }), customer.companyName || '');
            await this.mailerTransport.sendMail({
                companyId: customer.companyId,
                to: adminEmail,
                subject: `Bank Payment Submitted - ${invoice.invoiceNumber}`,
                html: emailHtml,
            });
        }
        catch (emailError) {
            console.error('Failed to send admin notification email:', emailError);
        }
        return savedInvoice;
    }
    async verifyBankPayment(invoiceId) {
        const invoice = await this.findOne(invoiceId);
        if (!invoice.bankPayment) {
            throw new common_1.BadRequestException('No bank payment found for this invoice');
        }
        if (invoice.bankPayment.status === bank_payment_dto_1.BankPaymentStatus.VERIFIED) {
            throw new common_1.BadRequestException('Bank payment already verified');
        }
        invoice.bankPayment.status = bank_payment_dto_1.BankPaymentStatus.VERIFIED;
        const paymentAmount = parseFloat(String(invoice.bankPayment.amount)) || 0;
        const newTotalPaidAmount = parseFloat(String(invoice.paidAmount)) + paymentAmount;
        const dueAmount = parseFloat(String(invoice.totalAmount)) - newTotalPaidAmount;
        invoice.paidAmount = newTotalPaidAmount;
        invoice.dueAmount = dueAmount < 0 ? 0 : dueAmount;
        invoice.status = newTotalPaidAmount >= invoice.totalAmount ? invoice_entity_1.InvoiceStatus.PAID : invoice_entity_1.InvoiceStatus.PENDING;
        const updatedInvoice = await this.invoiceRepository.save(invoice);
        if (updatedInvoice.status === invoice_entity_1.InvoiceStatus.PAID) {
            await this.handleInvoicePaid(updatedInvoice);
        }
        try {
            const customer = invoice.customer;
            const emailHtml = (0, templates_1.generatePaymentConfirmationEmail)(customer.name, invoice.invoiceNumber, invoice.totalAmount, paymentAmount, invoice.bankPayment.bankName || 'Bank Transfer', new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }), customer.companyName || '');
            await this.mailerTransport.sendMail({
                companyId: customer.companyId,
                to: customer.email,
                subject: `Payment Confirmed - Invoice ${invoice.invoiceNumber}`,
                html: emailHtml,
            });
        }
        catch (emailError) {
            console.error('Failed to send payment confirmation email:', emailError);
        }
        return updatedInvoice;
    }
    async rejectBankPayment(invoiceId, reason) {
        const invoice = await this.findOne(invoiceId);
        if (!invoice.bankPayment) {
            throw new common_1.BadRequestException('No bank payment found for this invoice');
        }
        invoice.bankPayment.status = bank_payment_dto_1.BankPaymentStatus.REJECTED;
        const updatedInvoice = await this.invoiceRepository.save(invoice);
        try {
            const customer = invoice.customer;
            const emailHtml = (0, templates_1.generatePaymentRejectionEmail)(customer.name, invoice.invoiceNumber, invoice.bankPayment.bankName || 'Bank Transfer', invoice.bankPayment.amount || 0, reason, customer.companyName || '');
            await this.mailerTransport.sendMail({
                companyId: customer.companyId,
                to: customer.email,
                subject: `Payment Update Required - Invoice ${invoice.invoiceNumber}`,
                html: emailHtml,
            });
        }
        catch (emailError) {
            console.error('Failed to send payment rejection email:', emailError);
        }
        return updatedInvoice;
    }
    async remove(id) {
        const invoice = await this.findOne(id);
        await this.invoiceRepository.softDelete(id);
    }
    async generateInvoiceNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const lastInvoice = await this.invoiceRepository
            .createQueryBuilder('invoice')
            .where('invoice.invoiceNumber LIKE :prefix', { prefix: `INV-${year}${month}%` })
            .orderBy('invoice.id', 'DESC')
            .getOne();
        let sequence = 1;
        if (lastInvoice) {
            const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
            sequence = lastSequence + 1;
        }
        return `INV-${year}${month}-${String(sequence).padStart(5, '0')}`;
    }
    generateTransactionId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `TXN${timestamp}${random}${randomChars}`;
    }
    async handleInvoicePaid(invoice) {
        try {
            const fullInvoice = await this.invoiceRepository.findOne({
                where: { id: invoice.id },
                relations: ['customer'],
            });
            if (!fullInvoice || !fullInvoice.customer) {
                return;
            }
            const customer = fullInvoice.customer;
            if (customer.subdomain) {
                return;
            }
            const baseSource = customer.companyName?.trim() ||
                customer.companyId?.trim() ||
                customer.email?.split('@')[0] ||
                `store-${customer.id}`;
            let slug = baseSource
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            if (!slug) {
                slug = `store-${customer.id}`;
            }
            let uniqueSlug = slug;
            let counter = 1;
            while (true) {
                const existing = await this.systemUserRepository.findOne({
                    where: { subdomain: uniqueSlug },
                });
                if (!existing) {
                    break;
                }
                counter += 1;
                uniqueSlug = `${slug}-${counter}`;
            }
            customer.subdomain = uniqueSlug;
            customer.subdomainEnabled =
                customer.subdomainEnabled !== undefined
                    ? customer.subdomainEnabled
                    : true;
            await this.systemUserRepository.save(customer);
            this.systemuserService
                .provisionSubdomainInRailway(customer.id)
                .catch((err) => console.error('Failed to provision subdomain in Railway:', err));
            this.systemuserService
                .sendInvoicePaidStoreReadyEmail(customer.id)
                .catch((err) => console.error('Failed to send invoice-paid store-ready email:', err));
        }
        catch (error) {
            console.error('Failed to handle post-payment tenant/subdomain provisioning:', error);
        }
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(1, (0, typeorm_1.InjectRepository)(systemuser_entity_1.SystemUser)),
    __param(3, (0, common_1.Inject)('MAILER_TRANSPORT')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService, Object, systemuser_service_1.SystemuserService])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map