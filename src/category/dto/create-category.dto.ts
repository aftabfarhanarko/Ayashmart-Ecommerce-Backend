import { IsString, IsOptional, IsBoolean } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  parentId?: number;

  @IsOptional()
  photo?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
