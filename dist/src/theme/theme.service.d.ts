import { Repository } from 'typeorm';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { Theme } from './entities/theme.entity';
export declare class ThemeService {
    private readonly themeRepository;
    constructor(themeRepository: Repository<Theme>);
    create(createThemeDto: CreateThemeDto): Promise<Theme>;
    findAll(): Promise<Theme[]>;
    findOne(id: number): Promise<Theme>;
    update(id: number, updateThemeDto: UpdateThemeDto): Promise<Theme>;
    remove(id: number): Promise<void>;
}
