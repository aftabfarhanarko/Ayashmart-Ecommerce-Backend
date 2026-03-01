import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog, ActivityAction, ActivityEntity } from './entities/activity-log.entity';
import { SystemUser } from './entities/systemuser.entity';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepo: Repository<ActivityLog>,
    @InjectRepository(SystemUser)
    private readonly systemUserRepo: Repository<SystemUser>,
  ) {}

  async logActivity(data: {
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
  }) {
    const log = this.activityLogRepo.create({
      ...data,
      performedBy: { id: data.performedByUserId } as SystemUser,
      targetUser: data.targetUserId ? { id: data.targetUserId } as SystemUser : undefined,
    });

    return await this.activityLogRepo.save(log);
  }

  async getActivityLogs(companyId: string | undefined, filters?: {
    performedByUserId?: number;
    targetUserId?: number;
    action?: ActivityAction;
    entity?: ActivityEntity;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const query = this.activityLogRepo
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.performedBy', 'performedBy')
      .leftJoinAndSelect('log.targetUser', 'targetUser')
      .orderBy('log.createdAt', 'DESC');
    
    // Only filter by companyId if provided (superadmins can pass undefined to see all)
    if (companyId) {
      query.where('log.companyId = :companyId', { companyId });
    }

    if (filters?.performedByUserId) {
      query.andWhere('log.performedByUserId = :performedByUserId', {
        performedByUserId: filters.performedByUserId,
      });
    }

    if (filters?.targetUserId) {
      query.andWhere('log.targetUserId = :targetUserId', {
        targetUserId: filters.targetUserId,
      });
    }

    if (filters?.action) {
      query.andWhere('log.action = :action', { action: filters.action });
    }

    if (filters?.entity) {
      query.andWhere('log.entity = :entity', { entity: filters.entity });
    }

    if (filters?.startDate) {
      query.andWhere('log.createdAt >= :startDate', { startDate: filters.startDate });
    }

    if (filters?.endDate) {
      query.andWhere('log.createdAt <= :endDate', { endDate: filters.endDate });
    }

    if (filters?.limit) {
      query.limit(filters.limit);
    }

    if (filters?.offset) {
      query.offset(filters.offset);
    }

    const [logs, total] = await query.getManyAndCount();

    return {
      logs,
      total,
      limit: filters?.limit || 50,
      offset: filters?.offset || 0,
    };
  }

  async getActivityLogById(id: number, companyId: string | undefined) {
    const whereCondition: any = { id };
    // Only filter by companyId if provided (superadmins can pass undefined to see all)
    if (companyId) {
      whereCondition.companyId = companyId;
    }
    return await this.activityLogRepo.findOne({
      where: whereCondition,
      relations: ['performedBy', 'targetUser'],
    });
  }
}
