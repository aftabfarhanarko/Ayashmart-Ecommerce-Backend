import { Expose, Type } from 'class-transformer';

export class PublicCategoryDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    slug: string;
}

export class PublicProductDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    sku: string;

    @Expose()
    price: number;

    @Expose()
    discountPrice: number;

    @Expose()
    thumbnail: string;

    @Expose()
    images: { url: string; alt?: string; isPrimary?: boolean }[];

    @Expose()
    @Type(() => PublicCategoryDto)
    category: PublicCategoryDto;

    @Expose()
    isFlashSell: boolean;

    @Expose()
    flashSellPrice: number;

    @Expose()
    flashSellStartTime: Date;

    @Expose()
    flashSellEndTime: Date;

    @Expose()
    isInStock: boolean;

    @Expose() // Only expose slug if it exists on entity, otherwise omit or compute
    slug: string;
}

export class AdminProductDto extends PublicProductDto {
    @Expose()
    stock: number;

    @Expose()
    newStock: number;

    @Expose()
    sold: number;

    @Expose()
    totalIncome: number;

    @Expose()
    isLowStock: boolean;

    @Expose()
    status: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}
