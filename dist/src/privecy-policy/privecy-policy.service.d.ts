import { Repository } from 'typeorm';
import { CreatePrivecyPolicyDto } from './dto/create-privecy-policy.dto';
import { UpdatePrivecyPolicyDto } from './dto/update-privecy-policy.dto';
import { PrivecyPolicy } from './entities/privecy-policy.entity';
export declare class PrivecyPolicyService {
    private readonly privacyPolicyRepo;
    constructor(privacyPolicyRepo: Repository<PrivecyPolicy>);
    create(createPrivecyPolicyDto: CreatePrivecyPolicyDto, companyId: string): Promise<PrivecyPolicy>;
    findAll(companyId: string): Promise<PrivecyPolicy[]>;
    findPublic(companyId: string): Promise<PrivecyPolicy[]>;
    findOne(id: number, companyId: string): Promise<PrivecyPolicy>;
    update(id: number, updatePrivecyPolicyDto: UpdatePrivecyPolicyDto, companyId: string): Promise<PrivecyPolicy>;
    remove(id: number, companyId: string): Promise<{
        success: boolean;
    }>;
}
