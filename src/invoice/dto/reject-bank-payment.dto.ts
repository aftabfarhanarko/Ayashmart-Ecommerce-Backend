import { IsOptional, IsString } from 'class-validator';

export class RejectBankPaymentDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
