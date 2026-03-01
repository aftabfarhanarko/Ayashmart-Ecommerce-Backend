import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
export declare class SettingController {
    private readonly settingService;
    constructor(settingService: SettingService);
    create(createSettingDto: CreateSettingDto): Promise<{
        status: string;
        message: string;
        data: import("./entities/setting.entity").Setting;
    }>;
    findAll(): Promise<{
        status: string;
        message: string;
        data: import("./entities/setting.entity").Setting[];
    }>;
    findOne(id: string): Promise<{
        status: string;
        message: string;
        data: import("./entities/setting.entity").Setting;
    }>;
    update(id: string, updateSettingDto: UpdateSettingDto): Promise<{
        status: string;
        message: string;
        data: import("./entities/setting.entity").Setting;
    }>;
    remove(id: string): Promise<{
        status: string;
        message: string;
    }>;
}
