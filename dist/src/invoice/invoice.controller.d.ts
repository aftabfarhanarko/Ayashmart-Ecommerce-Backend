import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InitiateBkashPaymentDto } from './dto/initiate-bkash-payment.dto';
import { BkashCallbackDto } from './dto/bkash-callback.dto';
import { BankPaymentDto } from './dto/bank-payment.dto';
import { RejectBankPaymentDto } from './dto/reject-bank-payment.dto';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    create(createInvoiceDto: CreateInvoiceDto): Promise<import("./entities/invoice.entity").Invoice>;
    findAll(customerId?: string): Promise<import("./entities/invoice.entity").Invoice[]>;
    findByInvoiceNumber(invoiceNumber: string): Promise<import("./entities/invoice.entity").Invoice>;
    findOne(id: string): Promise<import("./entities/invoice.entity").Invoice>;
    update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<import("./entities/invoice.entity").Invoice>;
    initiateBkashPayment(initiatePaymentDto: InitiateBkashPaymentDto): Promise<any>;
    executeBkashPayment(paymentID: string): Promise<import("./entities/invoice.entity").Invoice>;
    bkashCallback(bkashCallbackDto: BkashCallbackDto): Promise<import("./entities/invoice.entity").Invoice>;
    bkashCallbackGet(query: BkashCallbackDto): Promise<import("./entities/invoice.entity").Invoice>;
    processBankPayment(bankPaymentDto: BankPaymentDto): Promise<import("./entities/invoice.entity").Invoice>;
    verifyBankPayment(id: string): Promise<import("./entities/invoice.entity").Invoice>;
    rejectBankPayment(id: string, rejectDto?: RejectBankPaymentDto): Promise<import("./entities/invoice.entity").Invoice>;
    remove(id: string): Promise<void>;
}
