import { IsNotEmpty, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { AmountType, InvoiceStatus } from '../entities/invoice.entity';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsNumber()
  paidAmount?: number;

  @IsOptional()
  @IsEnum(AmountType)
  amountType?: AmountType;

  @IsOptional()
  @IsNumber()
  packageId?: number;

  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;
}
