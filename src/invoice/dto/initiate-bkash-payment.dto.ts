import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class InitiateBkashPaymentDto {
  @IsNotEmpty()
  @IsNumber()
  invoiceId: number;

  @IsOptional()
  @IsString()
  callbackURL?: string;
}
