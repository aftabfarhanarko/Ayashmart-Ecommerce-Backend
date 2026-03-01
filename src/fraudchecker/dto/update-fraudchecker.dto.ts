import { PartialType } from '@nestjs/mapped-types';
import { CreateFraudcheckerDto } from './create-fraudchecker.dto';

export class UpdateFraudcheckerDto extends PartialType(CreateFraudcheckerDto) {}
