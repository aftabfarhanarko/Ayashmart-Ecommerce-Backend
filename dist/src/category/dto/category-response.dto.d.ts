export declare class PublicCategoryDto {
    id: number;
    name: string;
    slug: string;
    photo: string;
    children: PublicCategoryDto[];
    parent: PublicCategoryDto;
}
