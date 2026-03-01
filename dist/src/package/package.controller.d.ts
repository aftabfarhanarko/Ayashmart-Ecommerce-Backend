import { HttpStatus } from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
export declare class PackageController {
    private readonly packageService;
    constructor(packageService: PackageService);
    create(createPackageDto: CreatePackageDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/package.entity").Package;
    }>;
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/package.entity").Package[];
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/package.entity").Package;
    }>;
    update(id: string, updatePackageDto: UpdatePackageDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/package.entity").Package;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            success: boolean;
        };
    }>;
}
