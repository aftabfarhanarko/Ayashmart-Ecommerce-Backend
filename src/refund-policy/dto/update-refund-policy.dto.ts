import { PartialType } from '@nestjs/mapped-types';
import { CreateRefundPolicyDto } from './create-refund-policy.dto';

export class UpdateRefundPolicyDto extends PartialType(CreateRefundPolicyDto) {}
