import { CreditNoteStatus } from '../entities/credit-note.entity';
export declare class CreateCreditNoteDto {
    creditNoteNumber: string;
    customerId: number;
    invoiceId?: number;
    amount: number;
    paymentMode?: string;
    status?: CreditNoteStatus;
    reason?: string;
    companyId: string;
}
