import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { mediaMulterConfig } from '../common/config/multer-media.config';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyIdGuard } from '../common/guards/company-id.guard';
import { CompanyId } from '../common/decorators/company-id.decorator';

@Controller('media')
@UseGuards(JwtAuthGuard, CompanyIdGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', mediaMulterConfig))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) {
      throw new BadRequestException('CompanyId is required');
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const media = await this.mediaService.uploadFile(file, companyId);
    const baseUrl = 'https://e-cdn.vercel.app';
    const fullUrl = media.url.startsWith('http') ? media.url : `${baseUrl}${media.url}`;
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Media uploaded successfully',
      success: true,
      data: { ...media, url: fullUrl },
      url: fullUrl,
    };
  }

  @Post()
  async create(
    @Body() createMediaDto: CreateMediaDto,
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) throw new BadRequestException('CompanyId is required');
    const media = await this.mediaService.create(createMediaDto, companyId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Media created successfully',
      data: media,
    };
  }

  @Get()
  async findAll(
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: 'newest' | 'name' | 'size' | 'date',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) throw new BadRequestException('CompanyId is required');
    const result = await this.mediaService.findAll(companyId, {
      search,
      sortBy,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 24,
    });

    const baseUrl =
      process.env.CDN_BASE_URL ||
      process.env.API_BASE_URL ||
      'http://localhost:8000';
    const data = result.data.map((m) => ({
      ...m,
      url: m.url.startsWith('http') ? m.url : `${baseUrl}${m.url}`,
      date: m.createdAt?.toISOString().split('T')[0] || '',
    }));

    return {
      statusCode: HttpStatus.OK,
      message: 'Media list fetched successfully',
      data,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) throw new BadRequestException('CompanyId is required');
    const media = await this.mediaService.findOne(id, companyId);
    if (!media) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'Media not found' };
    }
    const baseUrl =
      process.env.CDN_BASE_URL ||
      process.env.API_BASE_URL ||
      'http://localhost:8000';
    const url = media.url.startsWith('http') ? media.url : `${baseUrl}${media.url}`;
    return {
      statusCode: HttpStatus.OK,
      message: 'Media fetched successfully',
      data: { ...media, url, date: media.createdAt?.toISOString().split('T')[0] || '' },
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMediaDto: UpdateMediaDto,
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) throw new BadRequestException('CompanyId is required');
    const media = await this.mediaService.update(id, updateMediaDto, companyId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Media updated successfully',
      data: media,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) throw new BadRequestException('CompanyId is required');
    await this.mediaService.remove(id, companyId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Media deleted successfully',
    };
  }
}
