import { IsString, IsOptional, IsUrl, Matches } from 'class-validator';

export class CreateThemeDto {
  @IsOptional()
  @IsUrl()
  domainUrl?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-F]{6}$/i, {
    message: 'Primary color code must be a valid hex color code (e.g., #FF5733)',
  })
  primaryColorCode?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-F]{6}$/i, {
    message: 'Secondary color code must be a valid hex color code (e.g., #FF5733)',
  })
  secondaryColorCode?: string;
}
