export declare class CategoryEntity {
    id: number;
    name: string;
    slug: string;
    isActive: boolean;
    photo: string;
    companyId: string;
    resellerId?: number;
    parent: CategoryEntity | null;
    children: CategoryEntity[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
