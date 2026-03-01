import { FeaturePermission } from '../../systemuser/feature-permission.enum';
export declare const PERMISSION_KEY = "permission";
export declare const Permission: (permission: FeaturePermission) => import("@nestjs/common").CustomDecorator<string>;
