import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateOrderReceiptUrlDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  orderReceiptUrl?: string;
}
