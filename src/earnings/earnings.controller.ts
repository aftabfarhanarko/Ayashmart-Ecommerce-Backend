import { Controller, Get, UseGuards } from '@nestjs/common';
import { EarningsService } from './earnings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('earnings')
@UseGuards(JwtAuthGuard)
export class EarningsController {
    constructor(private readonly earningsService: EarningsService) { }

    @Get()
    getEarningsOverview() {
        return this.earningsService.getEarningsOverview();
    }
}

