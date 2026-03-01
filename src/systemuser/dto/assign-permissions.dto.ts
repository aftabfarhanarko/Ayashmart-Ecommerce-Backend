import { IsArray, IsEnum } from 'class-validator';
import { FeaturePermission } from '../feature-permission.enum';

export class AssignPermissionsDto {
  @IsArray()
  @IsEnum(FeaturePermission, { each: true })
  permissions: FeaturePermission[];
}
