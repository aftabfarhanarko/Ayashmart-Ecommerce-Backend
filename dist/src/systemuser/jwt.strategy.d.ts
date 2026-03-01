import { SystemuserService } from './systemuser.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly systemuserService;
    constructor(systemuserService: SystemuserService);
    validate(payload: any): Promise<{
        userId: any;
        companyId: any;
        email: any;
        permissions: any;
        role: any;
    }>;
}
export {};
