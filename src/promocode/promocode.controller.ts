import { BadRequestException, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Body, Query, UseGuards } from '@nestjs/common';
import { PromocodeService } from './promocode.service';
import { CreatePromocodeDto } from './dto/create-promocode.dto';
import { UpdatePromocodeDto } from './dto/update-promocode.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyIdGuard } from '../common/guards/company-id.guard';
import { CompanyId } from '../common/decorators/company-id.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('promocode')
@UseGuards(JwtAuthGuard, CompanyIdGuard)
export class PromocodeController {
  constructor(private readonly promocodeService: PromocodeService) { }

  @Public()
  @Get('public')
  async findPublic(@Query('companyId') companyId: string) {
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }
    const promos = await this.promocodeService.findPublic(companyId);
    return { statusCode: HttpStatus.OK, data: promos };
  }

  @Post()
  async create(
    @Body() dto: CreatePromocodeDto,
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }
    const promo = await this.promocodeService.create(dto, companyId);
    return { statusCode: HttpStatus.CREATED, message: 'Promocode created', data: promo };
  }

  @Get()
  async findAll(
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }
    const promos = await this.promocodeService.findAll(companyId);
    return { statusCode: HttpStatus.OK, data: promos };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }
    const promo = await this.promocodeService.findOne(id, companyId);
    return { statusCode: HttpStatus.OK, data: promo };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePromocodeDto,
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }
    const promo = await this.promocodeService.update(id, dto, companyId);
    return { statusCode: HttpStatus.OK, message: 'Promocode updated', data: promo };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }
    await this.promocodeService.remove(id, companyId);
    return { statusCode: HttpStatus.OK, message: 'Promocode soft deleted' };
  }

  @Patch(':id/toggle-active')
  async toggleActive(
    @Param('id', ParseIntPipe) id: number,
    @Query('active') active: string,
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }
    const isActive = active === 'true';
    const promo = await this.promocodeService.toggleActive(id, isActive, companyId);
    return { statusCode: HttpStatus.OK, message: `Promocode ${isActive ? 'activated' : 'disabled'}`, data: promo };
  }
}
