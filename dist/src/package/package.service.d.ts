import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Repository } from 'typeorm';
import { Package } from './entities/package.entity';
export declare class PackageService {
    private readonly packageRepo;
    constructor(packageRepo: Repository<Package>);
    create(createPackageDto: CreatePackageDto): Promise<Package>;
    findAll(): Promise<Package[]>;
    findOne(id: number): Promise<Package>;
    update(id: number, updatePackageDto: UpdatePackageDto): Promise<Package>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
}
