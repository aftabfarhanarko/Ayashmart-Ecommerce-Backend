import { HttpStatus } from '@nestjs/common';
import { PromocodeService } from './promocode.service';
import { CreatePromocodeDto } from './dto/create-promocode.dto';
import { UpdatePromocodeDto } from './dto/update-promocode.dto';
export declare class PromocodeController {
    private readonly promocodeService;
    constructor(promocodeService: PromocodeService);
    findPublic(companyId: string): Promise<{
        statusCode: HttpStatus;
        data: import("./entities/promocode.entity").PromocodeEntity[];
    }>;
    create(dto: CreatePromocodeDto, companyIdFromQuery?: string, companyIdFromToken?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/promocode.entity").PromocodeEntity;
    }>;
    findAll(companyIdFromQuery?: string, companyIdFromToken?: string): Promise<{
        statusCode: HttpStatus;
        data: import("./entities/promocode.entity").PromocodeEntity[];
    }>;
    findOne(id: number, companyIdFromQuery?: string, companyIdFromToken?: string): Promise<{
        statusCode: HttpStatus;
        data: import("./entities/promocode.entity").PromocodeEntity;
    }>;
    update(id: number, dto: UpdatePromocodeDto, companyIdFromQuery?: string, companyIdFromToken?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/promocode.entity").PromocodeEntity;
    }>;
    remove(id: number, companyIdFromQuery?: string, companyIdFromToken?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    toggleActive(id: number, active: string, companyIdFromQuery?: string, companyIdFromToken?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/promocode.entity").PromocodeEntity;
    }>;
}
