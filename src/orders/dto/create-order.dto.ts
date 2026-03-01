import { IsInt, IsArray, ArrayMinSize, ValidateNested, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

class OrderItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  quantity: number;
}

export class CreateOrderDto {
  @IsOptional()
  @IsInt()
  customerId?: number;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerAddress?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: "DIRECT" | "COD";

  // removed deliveryAddressId

  @IsOptional()
  pickupPoint?: any;

  @IsOptional()
  @IsString()
  deliveryType?: "INSIDEDHAKA" | "OUTSIDEDHAKA";

  @IsOptional()
  @IsString()
  ownerEmail?: string;

  @IsOptional()
  @IsString()
  ownerWhatsapp?: string;
}
