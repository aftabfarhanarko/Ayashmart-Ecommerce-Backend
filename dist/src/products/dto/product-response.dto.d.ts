export declare class PublicCategoryDto {
    id: number;
    name: string;
    slug: string;
}
export declare class PublicProductDto {
    id: number;
    name: string;
    sku: string;
    price: number;
    discountPrice: number;
    thumbnail: string;
    images: {
        url: string;
        alt?: string;
        isPrimary?: boolean;
    }[];
    category: PublicCategoryDto;
    isFlashSell: boolean;
    flashSellPrice: number;
    flashSellStartTime: Date;
    flashSellEndTime: Date;
    isInStock: boolean;
    slug: string;
}
export declare class AdminProductDto extends PublicProductDto {
    stock: number;
    newStock: number;
    sold: number;
    totalIncome: number;
    isLowStock: boolean;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
