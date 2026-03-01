import { IsOptional, IsIn } from 'class-validator';

export class QueryUsersDto {
  @IsOptional()
  @IsIn(['true', 'false'])
  isBanned?: 'true' | 'false';

  @IsOptional()
  @IsIn(['true', 'false'])
  isActive?: 'true' | 'false';

  @IsOptional()
  @IsIn(['has', 'none'])
  successfulOrders?: 'has' | 'none';

  @IsOptional()
  @IsIn(['has', 'none'])
  cancelledOrders?: 'has' | 'none';
}
