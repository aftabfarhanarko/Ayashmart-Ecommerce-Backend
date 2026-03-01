import { HttpStatus } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    upload(file: Express.Multer.File, companyIdFromQuery?: string, companyIdFromToken?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        success: boolean;
        data: {
            url: string;
            id: number;
            title: string;
            type: string;
            size: string;
            companyId: string;
            filename: string;
            createdAt: Date;
            updatedAt: Date;
        };
        url: string;
    }>;
    create(createMediaDto: CreateMediaDto, companyIdFromQuery?: string, companyIdFromToken?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/media.entity").MediaEntity;
    }>;
    findAll(companyIdFromQuery?: string, companyIdFromToken?: string, search?: string, sortBy?: 'newest' | 'name' | 'size' | 'date', page?: string, limit?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            url: string;
            date: string;
            id: number;
            title: string;
            type: string;
            size: string;
            companyId: string;
            filename: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: number, companyIdFromQuery?: string, companyIdFromToken?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data?: undefined;
    } | {
        statusCode: HttpStatus;
        message: string;
        data: {
            url: string;
            date: string;
            id: number;
            title: string;
            type: string;
            size: string;
            companyId: string;
            filename: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    update(id: number, updateMediaDto: UpdateMediaDto, companyIdFromQuery?: string, companyIdFromToken?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/media.entity").MediaEntity;
    }>;
    remove(id: number, companyIdFromQuery?: string, companyIdFromToken?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
