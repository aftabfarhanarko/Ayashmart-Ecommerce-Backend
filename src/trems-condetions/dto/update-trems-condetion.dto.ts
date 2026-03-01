import { PartialType } from '@nestjs/mapped-types';
import { CreateTremsCondetionDto } from './create-trems-condetion.dto';

export class UpdateTremsCondetionDto extends PartialType(CreateTremsCondetionDto) {}
