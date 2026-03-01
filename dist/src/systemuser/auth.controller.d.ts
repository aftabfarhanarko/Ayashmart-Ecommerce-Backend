import { SystemuserService } from './systemuser.service';
import { SuperadminService } from '../superadmin/superadmin.service';
import { LoginDto } from './dto/login.dto';
import { SuperadminLoginDto } from '../superadmin/dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateSystemuserDto } from './dto/update-systemuser.dto';
export declare class AuthController {
    private readonly systemuserService;
    private readonly superadminService;
    constructor(systemuserService: SystemuserService, superadminService: SuperadminService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    superadminLogin(dto: SuperadminLoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    getCurrentUser(req: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        message?: undefined;
    }>;
    updateCurrentUser(req: any, dto: UpdateSystemuserDto): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        message?: undefined;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(userId: string, token: string, dto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    refreshToken(body: {
        refreshToken: string;
    }): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            accessToken: string;
            refreshToken: string;
        };
        message?: undefined;
    }>;
}
