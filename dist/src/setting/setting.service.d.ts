import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { UpdateSmtpDto } from './dto/update-smtp.dto';
export declare class SettingService {
    private readonly settingRepo;
    constructor(settingRepo: Repository<Setting>);
    create(createSettingDto: CreateSettingDto): Promise<Setting>;
    findAll(): Promise<Setting[]>;
    findFirstByCompanyId(companyId: string): Promise<Setting>;
    findFirst(): Promise<Setting>;
    upsertSmtp(companyId: string, dto: UpdateSmtpDto): Promise<Setting>;
    findOne(id: number): Promise<Setting>;
    update(id: number, updateSettingDto: UpdateSettingDto): Promise<Setting>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
}
