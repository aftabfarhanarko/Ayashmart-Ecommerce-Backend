export declare enum UserRole {
    customer = "customer",
    admin = "admin"
}
export declare class CreateUserDto {
    name: string;
    email: string;
    phone?: string;
    district?: string;
    address?: string;
    password?: string;
    role?: UserRole;
    isActive?: boolean;
}
