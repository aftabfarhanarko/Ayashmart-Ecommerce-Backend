import { HttpStatus } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
export declare class ThemeController {
    private readonly themeService;
    constructor(themeService: ThemeService);
    create(createThemeDto: CreateThemeDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/theme.entity").Theme;
    }>;
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/theme.entity").Theme[];
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/theme.entity").Theme;
    }>;
    update(id: string, updateThemeDto: UpdateThemeDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/theme.entity").Theme;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
