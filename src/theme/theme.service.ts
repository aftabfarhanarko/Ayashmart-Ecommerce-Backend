import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  InternalServerErrorException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { Theme } from './entities/theme.entity';

@Injectable()
export class ThemeService {
  constructor(
    @InjectRepository(Theme)
    private readonly themeRepository: Repository<Theme>,
  ) {}

  async create(createThemeDto: CreateThemeDto): Promise<Theme> {
    try {
      const theme = this.themeRepository.create(createThemeDto);
      return await this.themeRepository.save(theme);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create theme', error.message);
    }
  }

  async findAll(): Promise<Theme[]> {
    try {
      return await this.themeRepository.find({
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve themes', error.message);
    }
  }

  async findOne(id: number): Promise<Theme> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid theme ID');
    }
    
    const theme = await this.themeRepository.findOne({ where: { id } });
    if (!theme) {
      throw new NotFoundException(`Theme with ID ${id} not found`);
    }
    return theme;
  }

  async update(id: number, updateThemeDto: UpdateThemeDto): Promise<Theme> {
    try {
      const theme = await this.findOne(id);
      Object.assign(theme, updateThemeDto);
      return await this.themeRepository.save(theme);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update theme', error.message);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const theme = await this.findOne(id);
      await this.themeRepository.remove(theme);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete theme', error.message);
    }
  }
}
