import { IsEmail, IsString, IsOptional, IsNumber, IsObject, IsArray, IsEnum } from 'class-validator';
import { FeaturePermission } from '../feature-permission.enum';
import { SystemUserRole } from '../system-user-role.enum';

export class PaymentInfoDto {
  @IsOptional()
  @IsString()
  paymentstatus?: string;

  @IsOptional()
  @IsString()
  paymentmethod?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  packagename?: string;
}

export class CreateSystemuserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  subdomain?: string;

  @IsOptional()
  @IsString()
  companyLogo?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  branchLocation?: string;

  @IsOptional()
  @IsNumber()
  packageId?: number;

  @IsOptional()
  @IsNumber()
  themeId?: number;

  @IsOptional()
  @IsObject()
  paymentInfo?: PaymentInfoDto;

  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @IsOptional()
  @IsArray()
  permissions?: FeaturePermission[];

  @IsOptional()
  @IsEnum(SystemUserRole)
  role?: SystemUserRole;

  // For reseller role: optional admin-defined commission % (e.g. 7.5 for 7.5%)
  @IsOptional()
  @IsNumber()
  resellerCommissionRate?: number;

  // For reseller role: use same companyId (no new company created)
  @IsOptional()
  @IsString()
  companyId?: string;
}
