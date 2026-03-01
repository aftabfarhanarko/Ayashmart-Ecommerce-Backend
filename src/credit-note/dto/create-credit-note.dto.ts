import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { CreditNoteStatus } from '../entities/credit-note.entity';

export class CreateCreditNoteDto {
  @IsNotEmpty()
  @IsString()
  creditNoteNumber: string;

  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @IsOptional()
  @IsNumber()
  invoiceId?: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  paymentMode?: string;

  @IsOptional()
  @IsEnum(CreditNoteStatus)
  status?: CreditNoteStatus;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsNotEmpty()
  @IsString()
  companyId: string;
}
