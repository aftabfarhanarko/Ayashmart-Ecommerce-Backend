import { IsString, IsOptional, IsBoolean } from "class-validator";

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  parentId?: number;

  @IsOptional()
  photo?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
