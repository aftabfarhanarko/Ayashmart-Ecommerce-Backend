import { IsInt, Min, IsOptional } from 'class-validator';

export class UpdateCartproductDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}
