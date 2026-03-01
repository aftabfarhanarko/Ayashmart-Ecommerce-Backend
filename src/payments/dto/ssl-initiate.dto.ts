import { IsNumber, IsString, IsEmail } from 'class-validator';

export class SslInitiateDto {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  orderId: string;

  @IsString()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsString()
  customerPhone: string;

  @IsString()
  customerAddress: string;
}