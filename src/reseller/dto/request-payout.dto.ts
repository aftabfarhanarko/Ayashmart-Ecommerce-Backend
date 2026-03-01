import { IsString, MaxLength, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class RequestPayoutDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  paymentDetails: string;

  /**
   * Optional commission rate (%) override for this payout.
   * If provided (admin flow), backend will use this instead of the reseller's default rate.
   */
  @IsOptional()
  @IsNumber()
  commissionRate?: number;
}

