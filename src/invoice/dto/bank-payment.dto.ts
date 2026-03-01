import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';

export enum BankPaymentStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export class BankPaymentDto {
  @IsNotEmpty()
  @IsNumber()
  invoiceId: number;

  @IsNotEmpty()
  @IsString()
  bankName: string;

  @IsNotEmpty()
  @IsString()
  accLastDigit: string;

  @IsOptional()
  @IsEnum(BankPaymentStatus)
  status?: BankPaymentStatus;
}
