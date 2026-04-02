import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaleInvoice, SaleInvoiceStatus } from './entities/sale-invoice.entity';
import { SaleInvoiceItem } from './entities/sale-invoice-item.entity';
import { CreateSaleInvoiceDto } from './dto/create-sale-invoice.dto';
import { UpdateSaleInvoiceDto } from './dto/update-sale-invoice.dto';
import { SystemuserService } from '../systemuser/systemuser.service';

@Injectable()
export class SaleInvoiceService {
  constructor(
    @InjectRepository(SaleInvoice)
    private readonly saleInvoiceRepository: Repository<SaleInvoice>,
    @InjectRepository(SaleInvoiceItem)
    private readonly saleInvoiceItemRepository: Repository<SaleInvoiceItem>,
    @Inject('MAILER_TRANSPORT')
    private readonly mailer: { sendMail: (message: unknown) => Promise<{ id?: string }> },
    private readonly systemuserService: SystemuserService,
  ) {}

  async create(createSaleInvoiceDto: CreateSaleInvoiceDto, companyId: string): Promise<SaleInvoice> {
    const { items, ...invoiceData } = createSaleInvoiceDto;
    const saleInvoice = this.saleInvoiceRepository.create({
      ...invoiceData,
      companyId,
      invoiceDate: new Date(invoiceData.invoiceDate),
      dueDate: invoiceData.dueDate ? new Date(invoiceData.dueDate) : undefined,
    });
    const saved = await this.saleInvoiceRepository.save(saleInvoice);

    if (items && items.length > 0) {
      const invoiceItems = items.map((item) =>
        this.saleInvoiceItemRepository.create({
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
        }),
      );
      await this.saleInvoiceItemRepository.save(invoiceItems);
    }

    return this.findOne(saved.id, companyId);
  }

  async findAll(companyId: string): Promise<SaleInvoice[]> {
    return await this.saleInvoiceRepository.find({
      where: { companyId },
      relations: ['customer', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, companyId: string): Promise<SaleInvoice> {
    const invoice = await this.saleInvoiceRepository.findOne({
      where: { id, companyId },
      relations: ['customer', 'items', 'items.product'],
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async update(id: number, companyId: string, updateDto: UpdateSaleInvoiceDto): Promise<SaleInvoice> {
    const invoice = await this.findOne(id, companyId);
    Object.assign(invoice, updateDto);
    await this.saleInvoiceRepository.save(invoice);
    return this.findOne(id, companyId);
  }

  async remove(id: number, companyId: string): Promise<void> {
    const invoice = await this.findOne(id, companyId);
    await this.saleInvoiceRepository.softRemove(invoice);
  }

  async revert(id: number, companyId: string): Promise<SaleInvoice> {
    const invoice = await this.findOne(id, companyId);
    if (invoice.status === SaleInvoiceStatus.CANCELLED) {
      throw new BadRequestException('Invoice is already cancelled');
    }
    invoice.status = SaleInvoiceStatus.CANCELLED;
    await this.saleInvoiceRepository.save(invoice);
    return this.findOne(id, companyId);
  }

  async sendEmail(id: number, companyId: string, pdfBase64: string): Promise<{ success: boolean; message: string }> {
    const invoice = await this.findOne(id, companyId);
    const customerEmail = invoice.customer?.email;
    if (!customerEmail) {
      throw new BadRequestException('Customer has no email address');
    }
    const fromAddress = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? 'squadlog.studio@gmail.com';

    // Resolve company name from the tenant (system user) instead of env
    let companyName = '';
    try {
      const tenant = await this.systemuserService.findOneByCompanyId(companyId);
      if (tenant?.companyName) {
        companyName = tenant.companyName;
      }
    } catch {
      companyName = '';
    }

    const subject =
      companyName && companyName.trim().length > 0
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
}
