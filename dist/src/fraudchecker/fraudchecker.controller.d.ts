import { HttpStatus } from '@nestjs/common';
import { FraudcheckerService } from './fraudchecker.service';
import { BanUserDto } from '../users/dto/ban-user.dto';
export declare class FraudcheckerController {
    private readonly fraudcheckerService;
    constructor(fraudcheckerService: FraudcheckerService);
    check(email?: string, name?: string, phone?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
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
        };
    } | {
        statusCode: HttpStatus;
        message: string;
        data: {
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
        };
    }>;
    flagUser(id: number, dto: BanUserDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("../users/entities/user.entity").User;
    }>;
    unflagUser(id: number): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("../users/entities/user.entity").User;
    }>;
    checkExternal(phone?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: any;
    }>;
}
