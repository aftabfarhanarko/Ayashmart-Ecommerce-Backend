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
exports.PrivecyPolicyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const privecy_policy_entity_1 = require("./entities/privecy-policy.entity");
let PrivecyPolicyService = class PrivecyPolicyService {
    constructor(privacyPolicyRepo) {
        this.privacyPolicyRepo = privacyPolicyRepo;
    }
    async create(createPrivecyPolicyDto, companyId) {
        if (!companyId) {
            throw new common_1.NotFoundException('CompanyId is required');
        }
        const entity = this.privacyPolicyRepo.create({
            content: createPrivecyPolicyDto.content,
            companyId: companyId,
        });
        return this.privacyPolicyRepo.save(entity);
    }
    async findAll(companyId) {
        return this.privacyPolicyRepo.find({
            where: { companyId },
            order: { createdAt: 'DESC' },
        });
    }
    async findPublic(companyId) {
        return this.findAll(companyId);
    }
    async findOne(id, companyId) {
        const entity = await this.privacyPolicyRepo.findOne({ where: { id, companyId } });
        if (!entity)
            throw new common_1.NotFoundException(`Privacy Policy ${id} not found`);
        return entity;
    }
    async update(id, updatePrivecyPolicyDto, companyId) {
        const entity = await this.findOne(id, companyId);
        const merged = this.privacyPolicyRepo.merge(entity, updatePrivecyPolicyDto);
        merged.companyId = companyId;
        return this.privacyPolicyRepo.save(merged);
    }
    async remove(id, companyId) {
        const entity = await this.findOne(id, companyId);
        await this.privacyPolicyRepo.softRemove(entity);
        return { success: true };
    }
};
exports.PrivecyPolicyService = PrivecyPolicyService;
exports.PrivecyPolicyService = PrivecyPolicyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(privecy_policy_entity_1.PrivecyPolicy)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PrivecyPolicyService);
//# sourceMappingURL=privecy-policy.service.js.map