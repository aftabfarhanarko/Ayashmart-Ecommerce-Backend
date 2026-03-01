import { SaleInvoiceService } from './sale-invoice.service';
import { CreateSaleInvoiceDto } from './dto/create-sale-invoice.dto';
import { UpdateSaleInvoiceDto } from './dto/update-sale-invoice.dto';
export declare class SaleInvoiceController {
    private readonly saleInvoiceService;
    constructor(saleInvoiceService: SaleInvoiceService);
    create(createSaleInvoiceDto: CreateSaleInvoiceDto, companyId: string): Promise<import("./entities/sale-invoice.entity").SaleInvoice>;
    findAll(companyId: string): Promise<import("./entities/sale-invoice.entity").SaleInvoice[]>;
    sendEmail(id: string, companyId: string, body: {
        pdfBase64: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    findOne(id: string, companyId: string): Promise<import("./entities/sale-invoice.entity").SaleInvoice>;
    update(id: string, companyId: string, updateDto: UpdateSaleInvoiceDto): Promise<import("./entities/sale-invoice.entity").SaleInvoice>;
    remove(id: string, companyId: string): Promise<void>;
    revert(id: string, companyId: string): Promise<import("./entities/sale-invoice.entity").SaleInvoice>;
}
