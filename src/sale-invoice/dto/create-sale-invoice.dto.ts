import { IsString, IsOptional, IsDateString, IsEnum, IsBoolean, IsNumber, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { SaleInvoiceStatus } from '../entities/sale-invoice.entity';
import { ItemType } from '../entities/sale-invoice-item.entity';

class CreateSaleInvoiceItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  productId?: number;

  @IsEnum(ItemType)
  @IsOptional()
  itemType?: ItemType;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  rate: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsNumber()
  @IsOptional()
  tax?: number;

  @IsNumber()
  amount: number;
}

export class CreateSaleInvoiceDto {
  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @IsDateString()
  invoiceDate: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsEnum(SaleInvoiceStatus)
  @IsOptional()
  status?: SaleInvoiceStatus;

  @IsNumber()
  customerId: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @IsString()
  @IsOptional()
  recurringInterval?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  termsAndConditions?: string;

  @IsOptional()
  bankDetails?: any;

  @IsNumber()
  subTotal: number;

  @IsNumber()
  taxTotal: number;

  @IsNumber()
  discountTotal: number;

  @IsNumber()
  totalAmount: number;

  @IsString()
  @IsOptional()
  signatureName?: string;

  @IsString()
  @IsOptional()
  signatureImage?: string;

  @IsString()
  @IsOptional()
  deliveryStatus?: string;

  @IsString()
  @IsOptional()
  fulfillmentStatus?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleInvoiceItemDto)
  items: CreateSaleInvoiceItemDto[];
}
