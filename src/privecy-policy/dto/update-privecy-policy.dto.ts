import { PartialType } from '@nestjs/mapped-types';
import { CreatePrivecyPolicyDto } from './create-privecy-policy.dto';

export class UpdatePrivecyPolicyDto extends PartialType(CreatePrivecyPolicyDto) {}
