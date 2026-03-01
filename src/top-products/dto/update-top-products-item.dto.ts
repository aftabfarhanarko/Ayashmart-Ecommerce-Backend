import { PartialType } from '@nestjs/mapped-types';
import { CreateTopProductsItemDto } from './create-top-products-item.dto';

export class UpdateTopProductsItemDto extends PartialType(
  CreateTopProductsItemDto,
) {}

