import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BkashCallbackDto {
  @IsNotEmpty()
  @IsString()
  paymentID: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  trxID?: string;

  @IsOptional()
  @IsString()
  transactionStatus?: string;

  @IsOptional()
  @IsString()
  amount?: string;

  @IsOptional()
  @IsString()
  customerMsisdn?: string;

  @IsOptional()
  @IsString()
  merchantInvoiceNumber?: string;

  @IsOptional()
  @IsString()
  paymentExecuteTime?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  intent?: string;

  @IsOptional()
  @IsString()
  statusCode?: string;

  @IsOptional()
  @IsString()
  statusMessage?: string;
}
