import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { TremsCondetionsService } from './trems-condetions.service';
import { CreateTremsCondetionDto } from './dto/create-trems-condetion.dto';
import { UpdateTremsCondetionDto } from './dto/update-trems-condetion.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyIdGuard } from '../common/guards/company-id.guard';
import { CompanyId } from '../common/decorators/company-id.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('trems-condetions')
@UseGuards(JwtAuthGuard, CompanyIdGuard)
export class TremsCondetionsController {
  constructor(private readonly tremsCondetionsService: TremsCondetionsService) { }

  @Post()
  async create(@Body() createTremsCondetionDto: CreateTremsCondetionDto, @CompanyId() companyId: string) {
    const data = await this.tremsCondetionsService.create(createTremsCondetionDto, companyId);
    return { status: 'success', message: 'Terms & Conditions created successfully', data };
  }

  @Public()
  @Get('public')
  async findPublic(@Query('companyId') companyId: string) {
    const data = await this.tremsCondetionsService.findPublic(companyId);
    return { status: 'success', message: 'Terms & Conditions fetched successfully', data };
  }

  @Get()
  async findAll(@CompanyId() companyId: string) {
    const data = await this.tremsCondetionsService.findAll(companyId);
    return { status: 'success', message: 'Terms & Conditions fetched successfully', data };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @CompanyId() companyId: string) {
    const data = await this.tremsCondetionsService.findOne(id, companyId);
    return { status: 'success', message: 'Terms & Conditions fetched successfully', data };
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateTremsCondetionDto: UpdateTremsCondetionDto, @CompanyId() companyId: string) {
    const data = await this.tremsCondetionsService.update(id, updateTremsCondetionDto, companyId);
    return { status: 'success', message: 'Terms & Conditions updated successfully', data };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @CompanyId() companyId: string) {
    await this.tremsCondetionsService.remove(id, companyId);
    return { status: 'success', message: 'Terms & Conditions removed successfully' };
  }
}
