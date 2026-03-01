import { RefundPolicyService } from './refund-policy.service';
import { CreateRefundPolicyDto } from './dto/create-refund-policy.dto';
import { UpdateRefundPolicyDto } from './dto/update-refund-policy.dto';
export declare class RefundPolicyController {
    private readonly refundPolicyService;
    constructor(refundPolicyService: RefundPolicyService);
    create(createRefundPolicyDto: CreateRefundPolicyDto, companyId: string): Promise<{
        status: string;
        message: string;
        data: import("./entities/refund-policy.entity").RefundPolicy;
    }>;
    findAll(companyId: string): Promise<{
        status: string;
        message: string;
        data: import("./entities/refund-policy.entity").RefundPolicy[];
    }>;
    findAllPublic(companyId: string): Promise<{
        status: string;
        message: string;
        data: import("./entities/refund-policy.entity").RefundPolicy[];
    }>;
    findOnePublic(id: number, companyId: string): Promise<{
        status: string;
        message: string;
        data: import("./entities/refund-policy.entity").RefundPolicy;
    }>;
    findOne(id: number, companyId: string): Promise<{
        status: string;
        message: string;
        data: import("./entities/refund-policy.entity").RefundPolicy;
    }>;
    update(id: number, updateRefundPolicyDto: UpdateRefundPolicyDto, companyId: string): Promise<{
        status: string;
        message: string;
        data: import("./entities/refund-policy.entity").RefundPolicy;
    }>;
    remove(id: number, companyId: string): Promise<{
        status: string;
        message: string;
    }>;
}
