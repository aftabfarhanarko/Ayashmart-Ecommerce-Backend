import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards
} from '@nestjs/common';
import { ThemeService } from './theme.service';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('theme')
@UseGuards(JwtAuthGuard)
export class ThemeController {
  constructor(private readonly themeService: ThemeService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createThemeDto: CreateThemeDto) {
    const theme = await this.themeService.create(createThemeDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Theme created successfully',
      data: theme,
    };
  }

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const themes = await this.themeService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Themes retrieved successfully',
      data: themes,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const theme = await this.themeService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Theme retrieved successfully',
      data: theme,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateThemeDto: UpdateThemeDto) {
    const theme = await this.themeService.update(+id, updateThemeDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Theme updated successfully',
      data: theme,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.themeService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Theme deleted successfully',
    };
  }
}
