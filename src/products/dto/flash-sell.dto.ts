import { IsArray, IsNumber, IsDateString, IsOptional, ArrayMinSize } from "class-validator";

export class FlashSellDto {
  @IsArray()
  @ArrayMinSize(1)
  productIds: number[];

  @IsDateString()
  flashSellStartTime: string;

  @IsDateString()
  flashSellEndTime: string;
  // fdfdg
  @IsOptional()
  @IsNumber()
  flashSellPrice?: number;
}

