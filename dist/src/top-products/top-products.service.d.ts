import { Repository } from 'typeorm';
import { TopProductsSectionEntity } from './entities/top-products-section.entity';
import { TopProductsItemEntity } from './entities/top-products-item.entity';
import { UpdateTopProductsSectionDto } from './dto/update-top-products-section.dto';
import { CreateTopProductsItemDto } from './dto/create-top-products-item.dto';
import { UpdateTopProductsItemDto } from './dto/update-top-products-item.dto';
export type TopProductItem = {
    id: number;
    title: string;
    desc: string;
    image: string;
    isActive: boolean;
    order: number;
};
export type TopProductSection = {
    leftImage: string | null;
    rightImage: string | null;
    carouselItems: TopProductItem[];
};
export declare class TopProductsService {
    private readonly sectionRepo;
    private readonly itemRepo;
    constructor(sectionRepo: Repository<TopProductsSectionEntity>, itemRepo: Repository<TopProductsItemEntity>);
    private ensureSection;
    private mapSection;
    getTopProductsPublic(companyId: string): Promise<TopProductSection>;
    getTopProductsAdmin(companyId: string): Promise<TopProductSection>;
    updateSection(companyId: string, dto: UpdateTopProductsSectionDto): Promise<TopProductsSectionEntity>;
    createItem(companyId: string, dto: CreateTopProductsItemDto): Promise<TopProductsItemEntity>;
    updateItem(companyId: string, id: number, dto: UpdateTopProductsItemDto): Promise<TopProductsItemEntity>;
    removeItem(companyId: string, id: number): Promise<void>;
}
