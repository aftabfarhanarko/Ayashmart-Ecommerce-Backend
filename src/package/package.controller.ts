import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('package')
@UseGuards(JwtAuthGuard)
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPackageDto: CreatePackageDto) {
    const data = await this.packageService.create(createPackageDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Package created successfully',
      data,
    };
  }

  /** Public: list packages for pricing/upgrade page (no auth required) */
  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const data = await this.packageService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Packages retrieved successfully',
      data,
    };
  }

  @Get(':id')
  @Public()
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const data = await this.packageService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Package retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  @Public()
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    const data = await this.packageService.update(+id, updatePackageDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Package updated successfully',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    const data = await this.packageService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Package deleted successfully',
      data,
    };
  }
}
