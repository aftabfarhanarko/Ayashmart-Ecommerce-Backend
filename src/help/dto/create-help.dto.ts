import { IsEmail, IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { SupportStatus } from '../entities/help.entity';

export class CreateHelpDto {
  @IsEmail()
  email: string;

  @IsString()
  issue: string;

  @IsOptional()
  @IsEnum(SupportStatus)
  status?: SupportStatus;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}