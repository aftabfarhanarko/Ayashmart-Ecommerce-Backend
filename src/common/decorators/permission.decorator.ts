import { SetMetadata } from '@nestjs/common';
import { FeaturePermission } from '../../systemuser/feature-permission.enum';

export const PERMISSION_KEY = 'permission';

export const Permission = (permission: FeaturePermission) =>
  SetMetadata(PERMISSION_KEY, permission);


