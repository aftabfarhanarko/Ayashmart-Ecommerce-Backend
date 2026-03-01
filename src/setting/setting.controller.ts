import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyIdGuard } from '../common/guards/company-id.guard';

@Controller('setting')
@UseGuards(JwtAuthGuard, CompanyIdGuard)
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Post()
  async create(@Body() createSettingDto: CreateSettingDto) {
    const data = await this.settingService.create(createSettingDto);
    return { status: 'success', message: 'Setting created successfully', data };
  }

  @Get()
  async findAll() {
    const data = await this.settingService.findAll();
    return { status: 'success', message: 'Settings fetched successfully', data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.settingService.findOne(+id);
    return { status: 'success', message: 'Setting fetched successfully', data };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
    const data = await this.settingService.update(+id, updateSettingDto);
    return { status: 'success', message: 'Setting updated successfully', data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.settingService.remove(+id);
    return { status: 'success', message: 'Setting removed successfully' };
  }
}
