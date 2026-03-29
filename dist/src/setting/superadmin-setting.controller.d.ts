import { SettingService } from './setting.service';
import { UpdateSmtpDto } from './dto/update-smtp.dto';
export declare class SuperadminSettingController {
    private readonly settingService;
    constructor(settingService: SettingService);
    private assertSuperAdmin;
    getSmtp(req?: any): Promise<{
        status: string;
        message: string;
        data: import("./entities/setting.entity").Setting;
    }>;
    upsertSmtp(dto: UpdateSmtpDto, req?: any): Promise<{
        status: string;
        message: string;
        data: import("./entities/setting.entity").Setting;
    }>;
}
