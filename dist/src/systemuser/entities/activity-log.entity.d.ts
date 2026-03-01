import { SystemUser } from './systemuser.entity';
export declare enum ActivityAction {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    PERMISSION_ASSIGN = "PERMISSION_ASSIGN",
    PERMISSION_REVOKE = "PERMISSION_REVOKE",
    STATUS_CHANGE = "STATUS_CHANGE",
    PASSWORD_CHANGE = "PASSWORD_CHANGE",
    BARCODE_SCAN = "BARCODE_SCAN"
}
export declare enum ActivityEntity {
    SYSTEM_USER = "SYSTEM_USER",
    PRODUCT = "PRODUCT",
    ORDER = "ORDER",
    CATEGORY = "CATEGORY",
    CUSTOMER = "CUSTOMER",
    INVENTORY = "INVENTORY",
    BANNER = "BANNER",
    PROMOCODE = "PROMOCODE"
}
export declare class ActivityLog {
    id: number;
    companyId: string;
    action: ActivityAction;
    entity: ActivityEntity;
    entityId: number;
    entityName: string;
    description: string;
    oldValues: Record<string, any>;
    newValues: Record<string, any>;
    performedByUserId: number;
    performedBy: SystemUser;
    targetUserId: number;
    targetUser: SystemUser;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
}
