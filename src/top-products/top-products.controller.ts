import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { CompanyId } from '../common/decorators/company-id.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyIdGuard } from '../common/guards/company-id.guard';
import { TopProductsService } from './top-products.service';
import { UpdateTopProductsSectionDto } from './dto/update-top-products-section.dto';
import { CreateTopProductsItemDto } from './dto/create-top-products-item.dto';
import { UpdateTopProductsItemDto } from './dto/update-top-products-item.dto';

@Controller('top-products')
@UseGuards(JwtAuthGuard, CompanyIdGuard)
export class TopProductsController {
  constructor(private readonly topProductsService: TopProductsService) {}

  @Get()
  async getAdminTopProducts(@CompanyId() companyId: string) {
    const data = await this.topProductsService.getTopProductsAdmin(companyId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Top products section fetched successfully',
      data,
    };
  }

  @Patch('section')
  async updateSection(
    @CompanyId() companyId: string,
    @Body() dto: UpdateTopProductsSectionDto,
  ) {
    const section = await this.topProductsService.updateSection(companyId, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Top products section updated successfully',
      data: section,
    };
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  async createItem(
    @CompanyId() companyId: string,
    @Body() dto: CreateTopProductsItemDto,
  ) {
    const item = await this.topProductsService.createItem(companyId, dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Top product item created successfully',
      data: item,
    };
  }

  @Patch('items/:id')
  async updateItem(
    @CompanyId() companyId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTopProductsItemDto,
  ) {
    const item = await this.topProductsService.updateItem(companyId, id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Top product item updated successfully',
      data: item,
    };
  }

  @Delete('items/:id')
  async removeItem(
    @CompanyId() companyId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.topProductsService.removeItem(companyId, id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Top product item deleted successfully',
    };
  }

  @Public()
  @Get('public')
  async getPublicTopProducts(@Query('companyId') companyId?: string) {
    if (!companyId) throw new BadRequestException('companyId is required');
    const data = await this.topProductsService.getTopProductsPublic(companyId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Top products section fetched successfully',
      data,
    };
  }
}

