import { SuperadminService } from './superadmin.service';
import { CreateSuperadminDto } from './dto/create-superadmin.dto';
import { SuperadminLoginDto } from './dto/login.dto';
import { WildcardDomainService } from '../common/services/wildcard-domain.service';
export declare class SuperadminController {
    private readonly superadminService;
    private readonly wildcardDomainService;
    constructor(superadminService: SuperadminService, wildcardDomainService: WildcardDomainService);
    login(dto: SuperadminLoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    setupWildcard(): Promise<import("../common/services/wildcard-domain.service").WildcardSetupResult>;
    create(createSuperadminDto: CreateSuperadminDto, req?: any): Promise<any>;
    findAll(req?: any): Promise<{
        id: number;
        name: string;
        email: string;
        designation: string;
        photo: string;
        permissions: string[];
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: Date;
    }[]>;
    findOne(id: string, req?: any): Promise<any>;
    update(id: string, updateSuperadminDto: Partial<CreateSuperadminDto>, req?: any): Promise<any>;
    remove(id: string, req?: any): Promise<{
        success: boolean;
    }>;
}
