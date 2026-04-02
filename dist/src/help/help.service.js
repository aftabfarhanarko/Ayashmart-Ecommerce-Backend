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
exports.HelpService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const common_2 = require("@nestjs/common");
const help_entity_1 = require("./entities/help.entity");
const help_support_gateway_1 = require("./help-support.gateway");
let HelpService = class HelpService {
    constructor(helpRepo, mailer, helpSupportGateway) {
        this.helpRepo = helpRepo;
        this.mailer = mailer;
        this.helpSupportGateway = helpSupportGateway;
    }
    async create(createHelpDto, companyId) {
        if (!companyId) {
            throw new common_1.NotFoundException('CompanyId is required');
        }
        const entity = this.helpRepo.create({
            email: createHelpDto.email,
            issue: createHelpDto.issue,
            status: createHelpDto.status ?? help_entity_1.SupportStatus.PENDING,
            companyId: companyId,
            priority: createHelpDto.priority ?? 'medium',
            tags: Array.isArray(createHelpDto.tags) ? createHelpDto.tags : [],
            attachments: Array.isArray(createHelpDto.attachments) ? createHelpDto.attachments : [],
        });
        const saved = await this.helpRepo.save(entity);
        await this.sendSupportEmail(saved, createHelpDto.email);
        return saved;
    }
    async findAll(companyId) {
        const where = companyId != null ? { companyId } : {};
        return this.helpRepo.find({
            where,
            order: { id: 'DESC' },
        });
    }
    async getStats(companyId) {
        const baseWhere = companyId != null ? { companyId } : {};
        const [all, pending, inProgress, resolved] = await Promise.all([
            this.helpRepo.count({ where: baseWhere }),
            this.helpRepo.count({ where: { ...baseWhere, status: help_entity_1.SupportStatus.PENDING } }),
            this.helpRepo.count({ where: { ...baseWhere, status: help_entity_1.SupportStatus.IN_PROGRESS } }),
            this.helpRepo.count({ where: { ...baseWhere, status: help_entity_1.SupportStatus.RESOLVED } }),
        ]);
        const active = pending + inProgress;
        return {
            total: all,
            pending,
            in_progress: inProgress,
            resolved,
            active,
        };
    }
    async findOne(id, companyId) {
        const where = companyId != null ? { id, companyId } : { id };
        const entity = await this.helpRepo.findOne({ where });
        if (!entity)
            throw new common_1.NotFoundException(`Help ticket ${id} not found`);
        return entity;
    }
    async update(id, updateHelpDto, companyId) {
        const entity = await this.findOne(id, companyId);
        const merged = this.helpRepo.merge(entity, updateHelpDto);
        if (companyId != null)
            merged.companyId = companyId;
        return this.helpRepo.save(merged);
    }
    async remove(id, companyId) {
        const entity = await this.findOne(id, companyId);
        await this.helpRepo.softRemove(entity);
        return { success: true };
    }
    async addReply(id, replyDto, companyId) {
        const entity = await this.findOne(id, companyId);
        const reply = {
            message: replyDto.message,
            author: replyDto.author,
            createdAt: new Date().toISOString(),
        };
        const replies = Array.isArray(entity.replies) ? [...entity.replies] : [];
        replies.push(reply);
        entity.replies = replies;
        const saved = await this.helpRepo.save(entity);
        try {
            this.helpSupportGateway.emitNewReply(id, reply);
        }
        catch (e) {
            console.error('Socket emit failed:', e);
        }
        return saved;
    }
    async sendSupportEmail(help, email) {
        try {
            const adminEmail = 'ashikurovi2003@gmail.com';
            await this.mailer.sendMail({
                companyId: help.companyId,
                from: email,
                to: adminEmail,
                subject: `New Support Issue from ${help.email}`,
                text: `Issue:\n${help.issue}\nStatus: ${help.status}\nTicket ID: ${help.id}`,
            });
        }
        catch (e) {
            console.error('Failed to send support email:', e);
        }
    }
};
exports.HelpService = HelpService;
exports.HelpService = HelpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(help_entity_1.Help)),
    __param(1, (0, common_2.Inject)('MAILER_TRANSPORT')),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object, help_support_gateway_1.HelpSupportGateway])
], HelpService);
//# sourceMappingURL=help.service.js.map