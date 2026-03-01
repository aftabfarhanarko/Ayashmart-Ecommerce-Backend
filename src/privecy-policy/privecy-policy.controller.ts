import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { PrivecyPolicyService } from './privecy-policy.service';
import { CreatePrivecyPolicyDto } from './dto/create-privecy-policy.dto';
import { UpdatePrivecyPolicyDto } from './dto/update-privecy-policy.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyIdGuard } from '../common/guards/company-id.guard';
import { CompanyId } from '../common/decorators/company-id.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('privecy-policy')
@UseGuards(JwtAuthGuard, CompanyIdGuard)
export class PrivecyPolicyController {
  constructor(private readonly privecyPolicyService: PrivecyPolicyService) { }

  @Post()
  async create(@Body() createPrivecyPolicyDto: CreatePrivecyPolicyDto, @CompanyId() companyId: string) {
    const data = await this.privecyPolicyService.create(createPrivecyPolicyDto, companyId);
    return { status: 'success', message: 'Privacy Policy created successfully', data };
  }

  @Public()
  @Get('public')
  async findPublic(@Query('companyId') companyId: string) {
    const data = await this.privecyPolicyService.findPublic(companyId);
    return { status: 'success', message: 'Privacy Policies fetched successfully', data };
  }

  @Get()
  async findAll(@CompanyId() companyId: string) {
    const data = await this.privecyPolicyService.findAll(companyId);
    return { status: 'success', message: 'Privacy Policies fetched successfully', data };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @CompanyId() companyId: string) {
    const data = await this.privecyPolicyService.findOne(id, companyId);
    return { status: 'success', message: 'Privacy Policy fetched successfully', data };
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePrivecyPolicyDto: UpdatePrivecyPolicyDto, @CompanyId() companyId: string) {
    const data = await this.privecyPolicyService.update(id, updatePrivecyPolicyDto, companyId);
    return { status: 'success', message: 'Privacy Policy updated successfully', data };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @CompanyId() companyId: string) {
    await this.privecyPolicyService.remove(id, companyId);
    return { status: 'success', message: 'Privacy Policy removed successfully' };
  }
}
