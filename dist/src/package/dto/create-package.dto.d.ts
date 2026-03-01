import { FeaturePermission } from '../../systemuser/feature-permission.enum';
export declare class CreatePackageDto {
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    isFeatured?: boolean;
    features?: FeaturePermission[];
    themeId?: number;
}
