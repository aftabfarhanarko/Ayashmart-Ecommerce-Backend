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
exports.RefundPolicyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const refund_policy_entity_1 = require("./entities/refund-policy.entity");
let RefundPolicyService = class RefundPolicyService {
    constructor(refundPolicyRepo) {
        this.refundPolicyRepo = refundPolicyRepo;
    }
    async create(createRefundPolicyDto, companyId) {
        if (!companyId) {
            throw new common_1.NotFoundException('CompanyId is required');
        }
        const entity = this.refundPolicyRepo.create({
            content: createRefundPolicyDto.content,
            companyId: companyId,
        });
        return this.refundPolicyRepo.save(entity);
    }
    async findAll(companyId) {
        return this.refundPolicyRepo.find({
            where: { companyId, deletedAt: (0, typeorm_2.IsNull)() },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, companyId) {
        const entity = await this.refundPolicyRepo.findOne({ where: { id, companyId, deletedAt: (0, typeorm_2.IsNull)() } });
        if (!entity)
            throw new common_1.NotFoundException(`Refund Policy ${id} not found`);
        return entity;
    }
    async update(id, updateRefundPolicyDto, companyId) {
        const entity = await this.findOne(id, companyId);
        const merged = this.refundPolicyRepo.merge(entity, updateRefundPolicyDto);
        merged.companyId = companyId;
        return this.refundPolicyRepo.save(merged);
    }
    async remove(id, companyId) {
        const entity = await this.findOne(id, companyId);
        await this.refundPolicyRepo.softRemove(entity);
        return { success: true };
    }
};
exports.RefundPolicyService = RefundPolicyService;
exports.RefundPolicyService = RefundPolicyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(refund_policy_entity_1.RefundPolicy)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RefundPolicyService);
//# sourceMappingURL=refund-policy.service.js.map