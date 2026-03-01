import { Repository } from 'typeorm';
import { CreateTremsCondetionDto } from './dto/create-trems-condetion.dto';
import { UpdateTremsCondetionDto } from './dto/update-trems-condetion.dto';
import { TremsCondetion } from './entities/trems-condetion.entity';
export declare class TremsCondetionsService {
    private readonly termsConditionsRepo;
    constructor(termsConditionsRepo: Repository<TremsCondetion>);
    create(createTremsCondetionDto: CreateTremsCondetionDto, companyId: string): Promise<TremsCondetion>;
    findAll(companyId: string): Promise<TremsCondetion[]>;
    findPublic(companyId: string): Promise<TremsCondetion[]>;
    findOne(id: number, companyId: string): Promise<TremsCondetion>;
    update(id: number, updateTremsCondetionDto: UpdateTremsCondetionDto, companyId: string): Promise<TremsCondetion>;
    remove(id: number, companyId: string): Promise<{
        success: boolean;
    }>;
}
