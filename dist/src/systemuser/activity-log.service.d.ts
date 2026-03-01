import { Repository } from 'typeorm';
import { ActivityLog, ActivityAction, ActivityEntity } from './entities/activity-log.entity';
import { SystemUser } from './entities/systemuser.entity';
export declare class ActivityLogService {
    private readonly activityLogRepo;
    private readonly systemUserRepo;
    constructor(activityLogRepo: Repository<ActivityLog>, systemUserRepo: Repository<SystemUser>);
    logActivity(data: {
        companyId: string;
        action: ActivityAction;
        entity: ActivityEntity;
        entityId?: number;
        entityName?: string;
        description?: string;
        oldValues?: Record<string, any>;
        newValues?: Record<string, any>;
        performedByUserId: number;
        targetUserId?: number;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<ActivityLog>;
    getActivityLogs(companyId: string | undefined, filters?: {
        performedByUserId?: number;
        targetUserId?: number;
        action?: ActivityAction;
        entity?: ActivityEntity;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
        offset?: number;
    }): Promise<{
        logs: ActivityLog[];
        total: number;
        limit: number;
        offset: number;
    }>;
    getActivityLogById(id: number, companyId: string | undefined): Promise<ActivityLog>;
}
