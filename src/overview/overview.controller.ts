import { Controller, Get, UseGuards } from '@nestjs/common';
import { OverviewService } from './overview.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('overview')
@UseGuards(JwtAuthGuard)
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) { }

  @Get()
  getOverview() {
    return this.overviewService.getOverview();
  }
}

