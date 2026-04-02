import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InitiateBkashPaymentDto } from './dto/initiate-bkash-payment.dto';
import { BkashCallbackDto } from './dto/bkash-callback.dto';
import { BankPaymentDto, BankPaymentStatus } from './dto/bank-payment.dto';
import { Invoice, InvoiceStatus } from './entities/invoice.entity';
import { SystemUser } from '../systemuser/entities/systemuser.entity';
import { ConfigService } from '@nestjs/config';
import { SystemuserService } from '../systemuser/systemuser.service';
import { 
  generatePaymentConfirmationEmail, 
  generatePaymentRejectionEmail,
  generateNewInvoiceAdminNotification,
  generateBankPaymentAdminNotification,
} from '../common/templates';

@Injectable()
export class InvoiceService {
  private bkashAppKey: string;
  private bkashAppSecret: string;
  private bkashUsername: string;
  private bkashPassword: string;
  private bkashBaseURL: string;
  private bkashGrantTokenURL: string;
  private bkashCreatePaymentURL: string;
  private bkashExecutePaymentURL: string;

  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(SystemUser)
    private systemUserRepository: Repository<SystemUser>,
    private configService: ConfigService,
    @Inject('MAILER_TRANSPORT')
    private readonly mailerTransport: any,
    private readonly systemuserService: SystemuserService,
  ) {
    this.bkashAppKey = this.configService.get<string>('BKASH_APP_KEY') || '';
    this.bkashAppSecret = this.configService.get<string>('BKASH_APP_SECRET') || '';
    this.bkashUsername = this.configService.get<string>('BKASH_USERNAME') || '';
    this.bkashPassword = this.configService.get<string>('BKASH_PASSWORD') || '';
    this.bkashBaseURL = this.configService.get<string>('BKASH_BASE_URL') || 'https://checkout.sandbox.bka.sh/v1.2.0-beta';
    this.bkashGrantTokenURL = `${this.bkashBaseURL}/checkout/token/grant`;
    this.bkashCreatePaymentURL = `${this.bkashBaseURL}/checkout/payment/create`;
    this.bkashExecutePaymentURL = `${this.bkashBaseURL}/checkout/payment/execute`;
  }

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    // Verify customer exists
    const customer = await this.systemUserRepository.findOne({
      where: { id: createInvoiceDto.customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${createInvoiceDto.customerId} not found`);
    }

    // Generate unique invoice number and transaction ID
    const invoiceNumber = await this.generateInvoiceNumber();
    const transactionId = this.generateTransactionId();

    // Calculate due amount
    const paidAmount = parseFloat(String(createInvoiceDto.paidAmount || 0));
    const dueAmount = parseFloat(String(createInvoiceDto.totalAmount)) - paidAmount;

    // Auto-update status based on payment
    let status = createInvoiceDto.status || InvoiceStatus.PENDING;
    if (paidAmount >= createInvoiceDto.totalAmount) {
      status = InvoiceStatus.PAID;
    }

    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      invoiceNumber,
      transactionId,
      dueAmount,
      status,
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    // If invoice is already fully paid on creation, ensure tenant/subdomain setup
    if (savedInvoice.status === InvoiceStatus.PAID) {
      await this.handleInvoicePaid(savedInvoice);
    }

    // Send admin notification email
    try {
      const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || 'admin@gmail.com';
      const emailHtml = generateNewInvoiceAdminNotification(
        customer.name,
        customer.email,
        savedInvoice.invoiceNumber,
        savedInvoice.transactionId,
        savedInvoice.totalAmount,
        savedInvoice.amountType,
        new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        customer.companyName || '',
      );

      await this.mailerTransport.sendMail({
        companyId: customer.companyId,
        to: adminEmail,
        subject: `New Invoice Created - ${savedInvoice.invoiceNumber}`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      // Don't throw error, invoice is already created
    }

    return savedInvoice;
  }

  async findAll(): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['customer'],
    }) as Invoice & { customer: SystemUser };

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async findByCustomer(customerId: number): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: { customerId },
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { invoiceNumber },
      relations: ['customer'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with number ${invoiceNumber} not found`);
    }

    return invoice;
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);

    // If updating customer, verify new customer exists
    if (updateInvoiceDto.customerId && updateInvoiceDto.customerId !== invoice.customerId) {
      const customer = await this.systemUserRepository.findOne({
        where: { id: updateInvoiceDto.customerId },
      });

      if (!customer) {
        throw new NotFoundException(`Customer with ID ${updateInvoiceDto.customerId} not found`);
      }
    }

    // Recalculate due amount if amounts changed
    const totalAmount = parseFloat(String(updateInvoiceDto.totalAmount ?? invoice.totalAmount));
    const paidAmount = parseFloat(String(updateInvoiceDto.paidAmount ?? invoice.paidAmount));
    const dueAmount = totalAmount - paidAmount;

    // Auto-update status based on payment
    let status = updateInvoiceDto.status || invoice.status;
    if (paidAmount >= totalAmount && status === InvoiceStatus.PENDING) {
      status = InvoiceStatus.PAID;
    }

    Object.assign(invoice, {
      ...updateInvoiceDto,
      dueAmount,
      status,
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);
    return savedInvoice;
  }

  async getBkashToken(): Promise<string> {
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
        throw new BadRequestException('Failed to get bKash token');
      }

      return data.id_token;
    } catch (error) {
      throw new BadRequestException('Failed to authenticate with bKash');
    }
  }

  async initiateBkashPayment(
    initiatePaymentDto: InitiateBkashPaymentDto,
  ): Promise<any> {
    const invoice = await this.findOne(initiatePaymentDto.invoiceId);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice is already paid');
    }

    if (invoice.status === InvoiceStatus.CANCELLED) {
      throw new BadRequestException('Invoice is cancelled');
    }

    // Get bKash token
    const token = await this.getBkashToken();

    // Create payment request
    const callbackURL = initiatePaymentDto.callbackURL || 
      `${this.configService.get<string>('APP_URL')}/api/invoice/bkash/callback`;

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
        throw new BadRequestException('Failed to create bKash payment');
      }

      // Save payment ID to invoice
      invoice.bkashPaymentID = data.paymentID;
      await this.invoiceRepository.save(invoice);

      return {
        success: true,
        invoice,
        paymentID: data.paymentID,
        bkashURL: data.bkashURL,
        message: 'bKash payment initiated successfully',
      };
    } catch (error) {
      throw new BadRequestException('Failed to initiate bKash payment');
    }
  }

  async executeBkashPayment(
    paymentID: string,
  ): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { bkashPaymentID: paymentID },
      relations: ['customer'],
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found for this payment');
    }

    // Get bKash token
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

      // Check if payment was successful
      if (data.transactionStatus !== 'Completed') {
        invoice.status = InvoiceStatus.FAILED;
        await this.invoiceRepository.save(invoice);
        throw new BadRequestException('bKash payment failed or incomplete');
      }

      // Update invoice with payment details
      const paidAmount = parseFloat(data.amount) || 0;
      const newTotalPaidAmount = parseFloat(String(invoice.paidAmount)) + paidAmount;
      const dueAmount = parseFloat(String(invoice.totalAmount)) - newTotalPaidAmount;

      invoice.paidAmount = newTotalPaidAmount;
      invoice.dueAmount = dueAmount < 0 ? 0 : dueAmount;
      invoice.status = newTotalPaidAmount >= invoice.totalAmount ? InvoiceStatus.PAID : InvoiceStatus.PENDING;
      invoice.bkashTrxID = data.trxID;

      const savedInvoice = await this.invoiceRepository.save(invoice);

      // If the invoice is now fully PAID, trigger tenant/subdomain setup
      if (savedInvoice.status === InvoiceStatus.PAID) {
        await this.handleInvoicePaid(savedInvoice);
      }

      return savedInvoice;
    } catch (error) {
      invoice.status = InvoiceStatus.FAILED;
      await this.invoiceRepository.save(invoice);
      throw new BadRequestException('Failed to execute bKash payment');
    }
  }

  async processBkashCallback(
    bkashCallbackDto: BkashCallbackDto,
  ): Promise<Invoice> {
    const { paymentID, status } = bkashCallbackDto;

    if (status === 'success') {
      return await this.executeBkashPayment(paymentID);
    } else {
      // Find invoice and mark as failed
      const invoice = await this.invoiceRepository.findOne({
        where: { bkashPaymentID: paymentID },
      });

      if (invoice) {
        invoice.status = InvoiceStatus.FAILED;
        await this.invoiceRepository.save(invoice);
      }

      throw new BadRequestException('bKash payment was not successful');
    }
  }

  async processBankPayment(
    bankPaymentDto: BankPaymentDto,
  ): Promise<Invoice> {
    const invoice = await this.findOne(bankPaymentDto.invoiceId);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice is already fully paid');
    }

    if (invoice.status === InvoiceStatus.CANCELLED) {
      throw new BadRequestException('Cannot process payment for cancelled invoice');
    }

    if (invoice.totalAmount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    // Store bank payment information
    invoice.bankPayment = {
      bankName: bankPaymentDto.bankName,
      amount: invoice.totalAmount,
      accLastDigit: bankPaymentDto.accLastDigit,
      status: bankPaymentDto.status || BankPaymentStatus.PENDING,
    };

    // If status is verified, update paid amount
    if (bankPaymentDto.status === BankPaymentStatus.VERIFIED) {
      const newTotalPaidAmount = parseFloat(String(invoice.paidAmount)) + parseFloat(String(invoice.totalAmount));
      const dueAmount = parseFloat(String(invoice.totalAmount)) - newTotalPaidAmount;

      invoice.paidAmount = newTotalPaidAmount;
      invoice.dueAmount = dueAmount < 0 ? 0 : dueAmount;
      invoice.status = newTotalPaidAmount >= invoice.totalAmount ? InvoiceStatus.PAID : InvoiceStatus.PENDING;
    }

    const savedInvoice = await this.invoiceRepository.save(invoice);

    // If this bank operation resulted in the invoice being PAID, trigger tenant/subdomain setup
    if (savedInvoice.status === InvoiceStatus.PAID) {
      await this.handleInvoicePaid(savedInvoice);
    }

    // Send admin notification email
    try {
      const customer = invoice.customer;
      const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || 'admin@gmail.com';
      const emailHtml = generateBankPaymentAdminNotification(
        customer.name,
        customer.email,
        invoice.invoiceNumber,
        invoice.transactionId,
        invoice.totalAmount,
        bankPaymentDto.bankName,
        invoice.totalAmount,
        bankPaymentDto.accLastDigit,
        new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        customer.companyName || '',
      );

      await this.mailerTransport.sendMail({
        companyId: customer.companyId,
        to: adminEmail,
        subject: `Bank Payment Submitted - ${invoice.invoiceNumber}`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      // Don't throw error, payment is already saved
    }

    return savedInvoice;
  }

  async verifyBankPayment(invoiceId: number): Promise<Invoice> {
    const invoice = await this.findOne(invoiceId);

    if (!invoice.bankPayment) {
      throw new BadRequestException('No bank payment found for this invoice');
    }

    if (invoice.bankPayment.status === BankPaymentStatus.VERIFIED) {
      throw new BadRequestException('Bank payment already verified');
    }

    // Update bank payment status to verified
    invoice.bankPayment.status = BankPaymentStatus.VERIFIED;

    // Update paid amount
    const paymentAmount = parseFloat(String(invoice.bankPayment.amount)) || 0;
    const newTotalPaidAmount = parseFloat(String(invoice.paidAmount)) + paymentAmount;
    const dueAmount = parseFloat(String(invoice.totalAmount)) - newTotalPaidAmount;

    invoice.paidAmount = newTotalPaidAmount;
    invoice.dueAmount = dueAmount < 0 ? 0 : dueAmount;
    invoice.status = newTotalPaidAmount >= invoice.totalAmount ? InvoiceStatus.PAID : InvoiceStatus.PENDING;

    const updatedInvoice = await this.invoiceRepository.save(invoice);

    // If this verification resulted in the invoice being PAID, trigger tenant/subdomain setup
    if (updatedInvoice.status === InvoiceStatus.PAID) {
      await this.handleInvoicePaid(updatedInvoice);
    }

    // Send confirmation email to customer
    try {
      const customer = invoice.customer;
      const emailHtml = generatePaymentConfirmationEmail(
        customer.name,
        invoice.invoiceNumber,
        invoice.totalAmount,
        paymentAmount,
        invoice.bankPayment.bankName || 'Bank Transfer',
        new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        customer.companyName || '',
      );

      await this.mailerTransport.sendMail({
        companyId: customer.companyId,
        to: customer.email,
        subject: `Payment Confirmed - Invoice ${invoice.invoiceNumber}`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Failed to send payment confirmation email:', emailError);
      // Don't throw error, payment is already verified
    }

    return updatedInvoice;
  }

  async rejectBankPayment(invoiceId: number, reason?: string): Promise<Invoice> {
    const invoice = await this.findOne(invoiceId);

    if (!invoice.bankPayment) {
      throw new BadRequestException('No bank payment found for this invoice');
    }

    // Update bank payment status to rejected
    invoice.bankPayment.status = BankPaymentStatus.REJECTED;

    const updatedInvoice = await this.invoiceRepository.save(invoice);

    // Send rejection email to customer
    try {
      const customer = invoice.customer;
      const emailHtml = generatePaymentRejectionEmail(
        customer.name,
        invoice.invoiceNumber,
        invoice.bankPayment.bankName || 'Bank Transfer',
        invoice.bankPayment.amount || 0,
        reason,
        customer.companyName || '',
      );

      await this.mailerTransport.sendMail({
        companyId: customer.companyId,
        to: customer.email,
        subject: `Payment Update Required - Invoice ${invoice.invoiceNumber}`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Failed to send payment rejection email:', emailError);
      // Don't throw error, payment is already rejected
    }

    return updatedInvoice;
  }

  async remove(id: number): Promise<void> {
    const invoice = await this.findOne(id);
    await this.invoiceRepository.softDelete(id);
  }

  private async generateInvoiceNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Find the last invoice of the current month
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

  private generateTransactionId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    return `TXN${timestamp}${random}${randomChars}`;
  }

  /**
   * Handle post-payment logic when an invoice becomes fully paid.
   * - Ensures the related SystemUser has a unique subdomain generated from company name.
   * - Keeps everything inside the existing multi-tenant model (SystemUser + SubdomainMiddleware).
   */
  private async handleInvoicePaid(invoice: Invoice): Promise<void> {
    try {
      // Reload invoice with customer relation to avoid partial entities
      const fullInvoice = await this.invoiceRepository.findOne({
        where: { id: invoice.id },
        relations: ['customer'],
      }) as Invoice & { customer: SystemUser };

      if (!fullInvoice || !fullInvoice.customer) {
        return;
      }

      const customer = fullInvoice.customer;

      // If subdomain already exists, nothing to do
      if (customer.subdomain) {
        return;
      }

      // Generate base slug from companyName or fallback fields
      const baseSource =
        customer.companyName?.trim() ||
        customer.companyId?.trim() ||
        customer.email?.split('@')[0] ||
        `store-${customer.id}`;

      let slug = baseSource
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with dashes
        .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes

      if (!slug) {
        slug = `store-${customer.id}`;
      }

      // Ensure uniqueness by appending numeric suffix if needed
      let uniqueSlug = slug;
      let counter = 1;
      // eslint-disable-next-line no-constant-condition
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
      // By default, enable platform subdomain so <slug>.console.innowavecart.app works
      (customer as any).subdomainEnabled =
        (customer as any).subdomainEnabled !== undefined
          ? (customer as any).subdomainEnabled
          : true;

      await this.systemUserRepository.save(customer);

      // Auto-provision subdomain in Railway (fire-and-forget)
      // This will add the subdomain (e.g., "ovi.console.innowavecart.app") to Railway
      // Railway will automatically provision SSL certificate once DNS is configured
      this.systemuserService
        .provisionSubdomainInRailway(customer.id)
        .catch((err) =>
          console.error('Failed to provision subdomain in Railway:', err),
        );

      // Send one email to the user with: Email, Password (temp), and Subdomain URL
      this.systemuserService
        .sendInvoicePaidStoreReadyEmail(customer.id)
        .catch((err) =>
          console.error('Failed to send invoice-paid store-ready email:', err),
        );
    } catch (error) {
      // We don't want payment flow to fail because of provisioning issues
      console.error('Failed to handle post-payment tenant/subdomain provisioning:', error);
    }
  }
}
