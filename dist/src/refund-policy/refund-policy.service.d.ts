import { Repository } from 'typeorm';
import { CreateRefundPolicyDto } from './dto/create-refund-policy.dto';
import { UpdateRefundPolicyDto } from './dto/update-refund-policy.dto';
import { RefundPolicy } from './entities/refund-policy.entity';
export declare class RefundPolicyService {
    private readonly refundPolicyRepo;
    constructor(refundPolicyRepo: Repository<RefundPolicy>);
    create(createRefundPolicyDto: CreateRefundPolicyDto, companyId: string): Promise<RefundPolicy>;
    findAll(companyId: string): Promise<RefundPolicy[]>;
    findOne(id: number, companyId: string): Promise<RefundPolicy>;
    update(id: number, updateRefundPolicyDto: UpdateRefundPolicyDto, companyId: string): Promise<RefundPolicy>;
    remove(id: number, companyId: string): Promise<{
        success: boolean;
    }>;
}
