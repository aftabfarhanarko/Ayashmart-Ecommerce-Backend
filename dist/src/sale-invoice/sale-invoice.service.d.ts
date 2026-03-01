import { Repository } from 'typeorm';
import { SaleInvoice } from './entities/sale-invoice.entity';
import { SaleInvoiceItem } from './entities/sale-invoice-item.entity';
import { CreateSaleInvoiceDto } from './dto/create-sale-invoice.dto';
import { UpdateSaleInvoiceDto } from './dto/update-sale-invoice.dto';
import { SystemuserService } from '../systemuser/systemuser.service';
export declare class SaleInvoiceService {
    private readonly saleInvoiceRepository;
    private readonly saleInvoiceItemRepository;
    private readonly mailer;
    private readonly systemuserService;
    constructor(saleInvoiceRepository: Repository<SaleInvoice>, saleInvoiceItemRepository: Repository<SaleInvoiceItem>, mailer: {
        sendMail: (message: unknown) => Promise<{
            id?: string;
        }>;
    }, systemuserService: SystemuserService);
    create(createSaleInvoiceDto: CreateSaleInvoiceDto, companyId: string): Promise<SaleInvoice>;
    findAll(companyId: string): Promise<SaleInvoice[]>;
    findOne(id: number, companyId: string): Promise<SaleInvoice>;
    update(id: number, companyId: string, updateDto: UpdateSaleInvoiceDto): Promise<SaleInvoice>;
    remove(id: number, companyId: string): Promise<void>;
    revert(id: number, companyId: string): Promise<SaleInvoice>;
    sendEmail(id: number, companyId: string, pdfBase64: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
