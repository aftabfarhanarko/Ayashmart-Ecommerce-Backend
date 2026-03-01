import { Repository } from 'typeorm';
import { CreditNote } from './entities/credit-note.entity';
import { CreateCreditNoteDto } from './dto/create-credit-note.dto';
export declare class CreditNoteService {
    private readonly creditNoteRepository;
    constructor(creditNoteRepository: Repository<CreditNote>);
    create(createCreditNoteDto: CreateCreditNoteDto): Promise<CreditNote>;
    findAllByCompany(companyId: string): Promise<CreditNote[]>;
    findOne(id: number, companyId: string): Promise<CreditNote>;
    remove(id: number, companyId: string): Promise<void>;
}
