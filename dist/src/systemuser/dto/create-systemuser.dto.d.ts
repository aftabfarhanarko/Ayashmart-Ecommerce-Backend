import { FeaturePermission } from '../feature-permission.enum';
import { SystemUserRole } from '../system-user-role.enum';
export declare class PaymentInfoDto {
    paymentstatus?: string;
    paymentmethod?: string;
    amount?: number;
    packagename?: string;
}
export declare class CreateSystemuserDto {
    name: string;
    email: string;
    password: string;
    companyName: string;
    subdomain?: string;
    companyLogo?: string;
    phone?: string;
    branchLocation?: string;
    packageId?: number;
    themeId?: number;
    paymentInfo?: PaymentInfoDto;
    primaryColor?: string;
    secondaryColor?: string;
    permissions?: FeaturePermission[];
    role?: SystemUserRole;
    resellerCommissionRate?: number;
    companyId?: string;
}
