import { HttpStatus } from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
export declare class BannerController {
    private readonly bannerService;
    constructor(bannerService: BannerService);
    create(dto: CreateBannerDto, companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/banner.entity").BannerEntity;
    }>;
    findAll(companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/banner.entity").BannerEntity[];
    }>;
    findAllPublic(companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/banner.entity").BannerEntity[];
    }>;
    findOne(id: number, companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/banner.entity").BannerEntity;
    }>;
    update(id: number, dto: UpdateBannerDto, companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/banner.entity").BannerEntity;
    }>;
    remove(id: number, companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
