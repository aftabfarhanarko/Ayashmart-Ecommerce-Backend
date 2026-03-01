export declare class SuperAdmin {
    id: number;
    name: string;
    email: string;
    designation: string;
    passwordHash: string;
    passwordSalt: string;
    photo: string;
    permissions: string[];
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
