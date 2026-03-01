import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { RefundPolicyService } from './refund-policy.service';
import { CreateRefundPolicyDto } from './dto/create-refund-policy.dto';
import { UpdateRefundPolicyDto } from './dto/update-refund-policy.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyIdGuard } from '../common/guards/company-id.guard';
import { CompanyId } from '../common/decorators/company-id.decorator';

@Controller('refund-policy')
@UseGuards(JwtAuthGuard, CompanyIdGuard)
export class RefundPolicyController {
  constructor(private readonly refundPolicyService: RefundPolicyService) { }

  @Post()
  async create(@Body() createRefundPolicyDto: CreateRefundPolicyDto, @CompanyId() companyId: string) {
    const data = await this.refundPolicyService.create(createRefundPolicyDto, companyId);
    return { status: 'success', message: 'Refund Policy created successfully', data };
  }

  @Get()
  async findAll(@CompanyId() companyId: string) {
    const data = await this.refundPolicyService.findAll(companyId);
    return { status: 'success', message: 'Refund Policies fetched successfully', data };
  }

  @Public()
  @Get('public')
  async findAllPublic(@Query('companyId') companyId: string) {
    const data = await this.refundPolicyService.findAll(companyId);
    return { status: 'success', message: 'Refund Policies fetched successfully', data };
  }

  @Public()
  @Get('public/:id')
  async findOnePublic(@Param('id', ParseIntPipe) id: number, @Query('companyId') companyId: string) {
    const data = await this.refundPolicyService.findOne(id, companyId);
    return { status: 'success', message: 'Refund Policy fetched successfully', data };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @CompanyId() companyId: string) {
    const data = await this.refundPolicyService.findOne(id, companyId);
    return { status: 'success', message: 'Refund Policy fetched successfully', data };
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateRefundPolicyDto: UpdateRefundPolicyDto, @CompanyId() companyId: string) {
    const data = await this.refundPolicyService.update(id, updateRefundPolicyDto, companyId);
    return { status: 'success', message: 'Refund Policy updated successfully', data };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @CompanyId() companyId: string) {
    await this.refundPolicyService.remove(id, companyId);
    return { status: 'success', message: 'Refund Policy removed successfully' };
  }
}
