import { PartialType } from '@nestjs/mapped-types';
import { CreateHelpDto } from './create-help.dto';

export class UpdateHelpDto extends PartialType(CreateHelpDto) {}
