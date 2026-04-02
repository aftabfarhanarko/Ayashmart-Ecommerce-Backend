import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { RequestContextService } from '../common/services/request-context.service';
import { UpdateSmtpDto } from './dto/update-smtp.dto';
import { UpdateFraudCheckerDto } from './dto/update-fraud-checker.dto';
import { UpdateOrderReceiptUrlDto } from './dto/update-order-receipt-url.dto';
export declare class SettingController {
    private readonly settingService;
    private readonly requestContext;
    constructor(settingService: SettingService, requestContext: RequestContextService);
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
    upsertSmtp(dto: UpdateSmtpDto): Promise<{
        status: string;
        message: string;
        data: import("./entities/setting.entity").Setting;
    }>;
    upsertFraudCheckerApi(dto: UpdateFraudCheckerDto): Promise<{
        status: string;
        message: string;
        data: import("./entities/setting.entity").Setting;
    }>;
    getFraudCheckerApi(): Promise<{
        status: string;
        data: {
            fraudCheckerApiKey: string;
        };
    }>;
    upsertOrderReceiptUrl(dto: UpdateOrderReceiptUrlDto): Promise<{
        status: string;
        message: string;
        data: import("./entities/setting.entity").Setting;
    }>;
    getOrderReceiptUrl(): Promise<{
        status: string;
        data: {
            orderReceiptUrl: string;
        };
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
