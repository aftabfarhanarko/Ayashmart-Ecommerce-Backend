import { HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { LoginDto } from './dto/login.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(body: CreateUserDto & {
        companyId?: string;
    }, companyIdFromQuery?: string): Promise<{
        accessToken?: string;
        user?: any;
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").User;
    }>;
    login(loginDto: LoginDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        accessToken: string;
        user: any;
    }>;
    forgotPassword(body: ForgotPasswordDto & {
        companyId?: string;
    }, companyIdFromQuery?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            success: boolean;
            message: string;
        };
    }>;
    resetPassword(userId: number, token: string, body: ResetPasswordDto & {
        companyId?: string;
    }, companyIdFromQuery?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            success: boolean;
            message: string;
        };
    }>;
    initialSetPassword(body: {
        email: string;
        password: string;
        confirmPassword: string;
        orderId?: number;
        companyId?: string;
    }, companyIdFromQuery?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            success: boolean;
            message: string;
        };
    }>;
    create(body: CreateUserDto & {
        companyId?: string;
    }, companyIdFromQuery?: string): Promise<{
        accessToken?: string;
        user?: any;
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").User;
    }>;
    getCurrentUser(userId: number, companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").User;
    }>;
    updateCurrentUser(userId: number, updateUserDto: UpdateUserDto, companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").User;
    }>;
    findAll(companyId: string, query: QueryUsersDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").User[];
    }>;
    findOne(id: number, companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").User;
    }>;
    update(id: number, updateUserDto: UpdateUserDto, companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").User;
    }>;
    ban(id: number, dto: BanUserDto, companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").User;
    }>;
    unban(id: number, companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").User;
    }>;
    remove(id: number, companyId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
