import { CreatePromocodeDto } from './dto/create-promocode.dto';
import { UpdatePromocodeDto } from './dto/update-promocode.dto';
import { Repository } from 'typeorm';
import { PromocodeEntity } from './entities/promocode.entity';
export declare class PromocodeService {
    private readonly promoRepo;
    constructor(promoRepo: Repository<PromocodeEntity>);
    create(dto: CreatePromocodeDto, companyId: string): Promise<PromocodeEntity>;
    findAll(companyId: string): Promise<PromocodeEntity[]>;
    findPublic(companyId: string): Promise<PromocodeEntity[]>;
    findOne(id: number, companyId: string): Promise<PromocodeEntity>;
    update(id: number, dto: UpdatePromocodeDto, companyId: string): Promise<PromocodeEntity>;
    remove(id: number, companyId: string): Promise<void>;
    toggleActive(id: number, active: boolean, companyId: string): Promise<PromocodeEntity>;
}
