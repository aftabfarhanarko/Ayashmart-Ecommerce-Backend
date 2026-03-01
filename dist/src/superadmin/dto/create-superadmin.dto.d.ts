import { FeaturePermission } from '../../systemuser/feature-permission.enum';
export declare class CreateSuperadminDto {
    name: string;
    email: string;
    designation?: string;
    password: string;
    photo?: string;
    permissions?: FeaturePermission[];
}
