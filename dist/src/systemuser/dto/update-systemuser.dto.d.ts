import { CreateSystemuserDto } from './create-systemuser.dto';
export declare class PathaoConfigDto {
    clientId?: string;
    clientSecret?: string;
    username?: string;
    password?: string;
}
export declare class SteadfastConfigDto {
    apiKey?: string;
    secretKey?: string;
}
export declare class RedxConfigDto {
    token?: string;
    sandbox?: boolean;
}
export declare class NotificationConfigDto {
    email?: string;
    whatsapp?: string;
}
declare const UpdateSystemuserDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateSystemuserDto>>;
export declare class UpdateSystemuserDto extends UpdateSystemuserDto_base {
    isActive?: boolean;
    pathaoConfig?: PathaoConfigDto;
    steadfastConfig?: SteadfastConfigDto;
    redxConfig?: RedxConfigDto;
    notificationConfig?: NotificationConfigDto;
}
export {};
