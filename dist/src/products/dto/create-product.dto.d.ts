import { ProductImageDto } from "./product-image.dto";
export declare class CreateProductDto {
    name: string;
    sku?: string;
    price: number;
    discountPrice?: number;
    categoryId?: number;
    isActive?: boolean;
    status?: 'draft' | 'published' | 'trashed' | 'pending';
    description?: string;
    images?: ProductImageDto[];
    thumbnail?: string;
    isFlashSell?: boolean;
    flashSellStartTime?: string;
    flashSellEndTime?: string;
    flashSellPrice?: number;
    stock?: number;
    newStock?: number;
    sold?: number;
    totalIncome?: number;
    isLowStock?: boolean;
    sizes?: (string | number)[];
    variants?: {
        name: string;
    }[];
    types?: string[];
    weight?: number;
    length?: number;
    breadth?: number;
    width?: number;
    unit?: string;
}
