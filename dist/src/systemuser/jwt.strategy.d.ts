import { SystemuserService } from './systemuser.service';
import { UsersService } from '../users/users.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly systemuserService;
    private readonly usersService;
    constructor(systemuserService: SystemuserService, usersService: UsersService);
    validate(payload: any): Promise<{
        userId: number;
        companyId: string;
        email: string;
        name: any;
        role: "customer" | "admin";
        permissions?: undefined;
    } | {
        userId: any;
        companyId: any;
        email: any;
        permissions: any;
        role: any;
        name?: undefined;
    }>;
}
export {};
