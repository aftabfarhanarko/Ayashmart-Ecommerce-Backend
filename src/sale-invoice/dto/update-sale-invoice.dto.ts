import { IsString, IsOptional, IsEnum } from 'class-validator';
import { SaleInvoiceStatus } from '../entities/sale-invoice.entity';

export class UpdateSaleInvoiceDto {
  @IsEnum(SaleInvoiceStatus)
  @IsOptional()
  status?: SaleInvoiceStatus;

  @IsString()
  @IsOptional()
  deliveryStatus?: string;

  @IsString()
  @IsOptional()
  fulfillmentStatus?: string;
}
