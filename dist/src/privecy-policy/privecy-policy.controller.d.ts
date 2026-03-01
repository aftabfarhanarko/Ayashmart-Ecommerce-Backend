import { PrivecyPolicyService } from './privecy-policy.service';
import { CreatePrivecyPolicyDto } from './dto/create-privecy-policy.dto';
import { UpdatePrivecyPolicyDto } from './dto/update-privecy-policy.dto';
export declare class PrivecyPolicyController {
    private readonly privecyPolicyService;
    constructor(privecyPolicyService: PrivecyPolicyService);
    create(createPrivecyPolicyDto: CreatePrivecyPolicyDto, companyId: string): Promise<{
        status: string;
        message: string;
        data: import("./entities/privecy-policy.entity").PrivecyPolicy;
    }>;
    findPublic(companyId: string): Promise<{
        status: string;
        message: string;
        data: import("./entities/privecy-policy.entity").PrivecyPolicy[];
    }>;
    findAll(companyId: string): Promise<{
        status: string;
        message: string;
        data: import("./entities/privecy-policy.entity").PrivecyPolicy[];
    }>;
    findOne(id: number, companyId: string): Promise<{
        status: string;
        message: string;
        data: import("./entities/privecy-policy.entity").PrivecyPolicy;
    }>;
    update(id: number, updatePrivecyPolicyDto: UpdatePrivecyPolicyDto, companyId: string): Promise<{
        status: string;
        message: string;
        data: import("./entities/privecy-policy.entity").PrivecyPolicy;
    }>;
    remove(id: number, companyId: string): Promise<{
        status: string;
        message: string;
    }>;
}
