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
exports.SaleInvoiceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sale_invoice_entity_1 = require("./entities/sale-invoice.entity");
const sale_invoice_item_entity_1 = require("./entities/sale-invoice-item.entity");
const systemuser_service_1 = require("../systemuser/systemuser.service");
let SaleInvoiceService = class SaleInvoiceService {
    constructor(saleInvoiceRepository, saleInvoiceItemRepository, mailer, systemuserService) {
        this.saleInvoiceRepository = saleInvoiceRepository;
        this.saleInvoiceItemRepository = saleInvoiceItemRepository;
        this.mailer = mailer;
        this.systemuserService = systemuserService;
    }
    async create(createSaleInvoiceDto, companyId) {
        const { items, ...invoiceData } = createSaleInvoiceDto;
        const saleInvoice = this.saleInvoiceRepository.create({
            ...invoiceData,
            companyId,
            invoiceDate: new Date(invoiceData.invoiceDate),
            dueDate: invoiceData.dueDate ? new Date(invoiceData.dueDate) : undefined,
        });
        const saved = await this.saleInvoiceRepository.save(saleInvoice);
        if (items && items.length > 0) {
            const invoiceItems = items.map((item) => this.saleInvoiceItemRepository.create({
                invoiceId: saved.id,
                name: item.name,
                productId: item.productId,
                itemType: item.itemType,
                quantity: item.quantity,
                unit: item.unit ?? 'Pcs',
                rate: item.rate,
                discount: item.discount ?? 0,
                tax: item.tax ?? 0,
                amount: item.amount,
            }));
            await this.saleInvoiceItemRepository.save(invoiceItems);
        }
        return this.findOne(saved.id, companyId);
    }
    async findAll(companyId) {
        return await this.saleInvoiceRepository.find({
            where: { companyId },
            relations: ['customer', 'items', 'items.product'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, companyId) {
        const invoice = await this.saleInvoiceRepository.findOne({
            where: { id, companyId },
            relations: ['customer', 'items', 'items.product'],
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice with ID ${id} not found`);
        }
        return invoice;
    }
    async update(id, companyId, updateDto) {
        const invoice = await this.findOne(id, companyId);
        Object.assign(invoice, updateDto);
        await this.saleInvoiceRepository.save(invoice);
        return this.findOne(id, companyId);
    }
    async remove(id, companyId) {
        const invoice = await this.findOne(id, companyId);
        await this.saleInvoiceRepository.softRemove(invoice);
    }
    async revert(id, companyId) {
        const invoice = await this.findOne(id, companyId);
        if (invoice.status === sale_invoice_entity_1.SaleInvoiceStatus.CANCELLED) {
            throw new common_1.BadRequestException('Invoice is already cancelled');
        }
        invoice.status = sale_invoice_entity_1.SaleInvoiceStatus.CANCELLED;
        await this.saleInvoiceRepository.save(invoice);
        return this.findOne(id, companyId);
    }
    async sendEmail(id, companyId, pdfBase64) {
        const invoice = await this.findOne(id, companyId);
        const customerEmail = invoice.customer?.email;
        if (!customerEmail) {
            throw new common_1.BadRequestException('Customer has no email address');
        }
        const fromAddress = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? 'squadlog.studio@gmail.com';
        let companyName = '';
        try {
            const tenant = await this.systemuserService.findOneByCompanyId(companyId);
            if (tenant?.companyName) {
                companyName = tenant.companyName;
            }
        }
        catch {
            companyName = '';
        }
        const subject = companyName && companyName.trim().length > 0
            ? `Invoice #${invoice.invoiceNumber} from ${companyName}`
            : `Invoice #${invoice.invoiceNumber}`;
        const html = `
      <p>Dear ${invoice.customer?.name || 'Customer'},</p>
      <p>Please find your invoice #${invoice.invoiceNumber} attached as a PDF.</p>
      <p>Total Amount: ${invoice.totalAmount} ${invoice.currency || 'BDT'}</p>
      <p>Thank you for your business.</p>
    `;
        await this.mailer.sendMail({
            companyId,
            from: fromAddress,
            to: customerEmail,
            subject,
            html,
            attachments: [
                {
                    filename: `invoice-${invoice.invoiceNumber}.pdf`,
                    content: Buffer.from(pdfBase64, 'base64'),
                },
            ],
        });
        return { success: true, message: `Invoice sent to ${customerEmail}` };
    }
};
exports.SaleInvoiceService = SaleInvoiceService;
exports.SaleInvoiceService = SaleInvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sale_invoice_entity_1.SaleInvoice)),
    __param(1, (0, typeorm_1.InjectRepository)(sale_invoice_item_entity_1.SaleInvoiceItem)),
    __param(2, (0, common_1.Inject)('MAILER_TRANSPORT')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object, systemuser_service_1.SystemuserService])
], SaleInvoiceService);
//# sourceMappingURL=sale-invoice.service.js.map