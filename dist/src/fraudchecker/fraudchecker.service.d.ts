import { UsersService } from '../users/users.service';
import { RequestContextService } from '../common/services/request-context.service';
import { SettingService } from '../setting/setting.service';
export declare class FraudcheckerService {
    private readonly usersService;
    private readonly requestContextService;
    private readonly settingService;
    constructor(usersService: UsersService, requestContextService: RequestContextService, settingService: SettingService);
    checkUserRisk(userId: number): Promise<{
        userId: number;
        email: string;
        name: string;
        phone: string;
        isBanned: boolean;
        riskScore: number;
        riskReasons: string[];
        successfulOrders: number;
        cancelledOrders: number;
        totalOrders: number;
    }>;
    checkUserRiskByPhone(phone: string): Promise<{
        userId: number;
        email: string;
        name: string;
        phone: string;
        isBanned: boolean;
        riskScore: number;
        riskReasons: string[];
        successfulOrders: number;
        cancelledOrders: number;
        totalOrders: number;
    }>;
    checkUserRiskByEmail(email: string): Promise<{
        userId: number;
        email: string;
        name: string;
        phone: string;
        isBanned: boolean;
        riskScore: number;
        riskReasons: string[];
        successfulOrders: number;
        cancelledOrders: number;
        totalOrders: number;
    }>;
    checkUserRiskByName(name: string): Promise<{
        count: number;
        results: {
            userId: number;
            email: string;
            name: string;
            phone: string;
            isBanned: boolean;
            riskScore: number;
            riskReasons: string[];
            successfulOrders: number;
            cancelledOrders: number;
            totalOrders: number;
        }[];
    }>;
    flagUser(userId: number, reason?: string): Promise<import("../users/entities/user.entity").User>;
    unflagUser(userId: number): Promise<import("../users/entities/user.entity").User>;
    checkByPhoneExternal(phone: string): Promise<any>;
}
