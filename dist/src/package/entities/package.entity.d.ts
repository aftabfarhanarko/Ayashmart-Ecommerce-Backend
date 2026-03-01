import { SystemUser } from "../../systemuser/entities/systemuser.entity";
import { Theme } from "../../theme/entities/theme.entity";
import { FeaturePermission } from "../../systemuser/feature-permission.enum";
export declare class Package {
    id: number;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    isFeatured: boolean;
    features: FeaturePermission[];
    themeId: number;
    theme: Theme;
    systemUsers: SystemUser[] | any;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
