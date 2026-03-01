import { Repository } from 'typeorm';
import { BannerEntity } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
export declare class BannerService {
    private readonly bannerRepository;
    constructor(bannerRepository: Repository<BannerEntity>);
    create(dto: CreateBannerDto, companyId: string): Promise<BannerEntity>;
    findAll(companyId: string): Promise<BannerEntity[]>;
    findOne(id: number, companyId: string): Promise<BannerEntity | null>;
    update(id: number, dto: UpdateBannerDto, companyId: string): Promise<BannerEntity>;
    remove(id: number, companyId: string): Promise<void>;
}
