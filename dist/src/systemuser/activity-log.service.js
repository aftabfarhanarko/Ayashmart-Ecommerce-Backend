"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const activity_log_entity_1 = require("./entities/activity-log.entity");
const systemuser_entity_1 = require("./entities/systemuser.entity");
let ActivityLogService = class ActivityLogService {
    constructor(activityLogRepo, systemUserRepo) {
        this.activityLogRepo = activityLogRepo;
        this.systemUserRepo = systemUserRepo;
    }
    async logActivity(data) {
        const log = this.activityLogRepo.create({
            ...data,
            performedBy: { id: data.performedByUserId },
            targetUser: data.targetUserId ? { id: data.targetUserId } : undefined,
        });
        return await this.activityLogRepo.save(log);
    }
    async getActivityLogs(companyId, filters) {
        const query = this.activityLogRepo
            .createQueryBuilder('log')
            .leftJoinAndSelect('log.performedBy', 'performedBy')
            .leftJoinAndSelect('log.targetUser', 'targetUser')
            .orderBy('log.createdAt', 'DESC');
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
    async getActivityLogById(id, companyId) {
        const whereCondition = { id };
        if (companyId) {
            whereCondition.companyId = companyId;
        }
        return await this.activityLogRepo.findOne({
            where: whereCondition,
            relations: ['performedBy', 'targetUser'],
        });
    }
};
exports.ActivityLogService = ActivityLogService;
exports.ActivityLogService = ActivityLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(activity_log_entity_1.ActivityLog)),
    __param(1, (0, typeorm_1.InjectRepository)(systemuser_entity_1.SystemUser)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ActivityLogService);
//# sourceMappingURL=activity-log.service.js.map