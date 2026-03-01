import { Expose, Type } from 'class-transformer';

export class PublicCategoryDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    slug: string;

    @Expose()
    photo: string;

    @Expose()
    @Type(() => PublicCategoryDto)
    children: PublicCategoryDto[];

    @Expose()
    @Type(() => PublicCategoryDto)
    parent: PublicCategoryDto;
}
