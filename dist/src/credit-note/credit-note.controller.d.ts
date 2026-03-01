import { CreditNoteService } from './credit-note.service';
import { CreateCreditNoteDto } from './dto/create-credit-note.dto';
export declare class CreditNoteController {
    private readonly creditNoteService;
    constructor(creditNoteService: CreditNoteService);
    create(createCreditNoteDto: CreateCreditNoteDto): Promise<import("./entities/credit-note.entity").CreditNote>;
    findAll(companyId: string): Promise<import("./entities/credit-note.entity").CreditNote[]>;
    findOne(id: string, companyId: string): Promise<import("./entities/credit-note.entity").CreditNote>;
    remove(id: string, companyId: string): Promise<void>;
}
