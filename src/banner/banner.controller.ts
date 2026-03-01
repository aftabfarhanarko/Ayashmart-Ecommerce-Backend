import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus, NotFoundException, UseGuards, Query } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyIdGuard } from '../common/guards/company-id.guard';
import { CompanyId } from '../common/decorators/company-id.decorator';

@Controller('banners')
@UseGuards(JwtAuthGuard, CompanyIdGuard)
export class BannerController {
  constructor(private readonly bannerService: BannerService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateBannerDto, @CompanyId() companyId: string) {
    const banner = await this.bannerService.create(dto, companyId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Banner created successfully',
      data: banner,
    };
  }

  @Get()
  async findAll(@CompanyId() companyId: string) {
    const banners = await this.bannerService.findAll(companyId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Banner list fetched successfully',
      data: banners,
    };
  }

  @Public()
  @Get('public')
  async findAllPublic(@Query('companyId') companyId: string) {
    const banners = await this.bannerService.findAll(companyId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Banner list fetched successfully',
      data: banners,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @CompanyId() companyId: string) {
    const banner = await this.bannerService.findOne(id, companyId);
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Banner fetched successfully',
      data: banner,
    };
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBannerDto, @CompanyId() companyId: string) {
    const updated = await this.bannerService.update(id, dto, companyId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Banner updated successfully',
      data: updated,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @CompanyId() companyId: string) {
    await this.bannerService.remove(id, companyId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Banner deleted successfully',
    };
  }
}
