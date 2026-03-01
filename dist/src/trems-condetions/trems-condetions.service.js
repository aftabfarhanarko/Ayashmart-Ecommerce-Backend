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
exports.TremsCondetionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const trems_condetion_entity_1 = require("./entities/trems-condetion.entity");
let TremsCondetionsService = class TremsCondetionsService {
    constructor(termsConditionsRepo) {
        this.termsConditionsRepo = termsConditionsRepo;
    }
    async create(createTremsCondetionDto, companyId) {
        if (!companyId) {
            throw new common_1.NotFoundException('CompanyId is required');
        }
        const entity = this.termsConditionsRepo.create({
            content: createTremsCondetionDto.content,
            companyId: companyId,
        });
        return this.termsConditionsRepo.save(entity);
    }
    async findAll(companyId) {
        return this.termsConditionsRepo.find({
            where: { companyId },
            order: { createdAt: 'DESC' },
        });
    }
    async findPublic(companyId) {
        return this.findAll(companyId);
    }
    async findOne(id, companyId) {
        const entity = await this.termsConditionsRepo.findOne({ where: { id, companyId } });
        if (!entity)
            throw new common_1.NotFoundException(`Terms & Conditions ${id} not found`);
        return entity;
    }
    async update(id, updateTremsCondetionDto, companyId) {
        const entity = await this.findOne(id, companyId);
        const merged = this.termsConditionsRepo.merge(entity, updateTremsCondetionDto);
        merged.companyId = companyId;
        return this.termsConditionsRepo.save(merged);
    }
    async remove(id, companyId) {
        const entity = await this.findOne(id, companyId);
        await this.termsConditionsRepo.softRemove(entity);
        return { success: true };
    }
};
exports.TremsCondetionsService = TremsCondetionsService;
exports.TremsCondetionsService = TremsCondetionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(trems_condetion_entity_1.TremsCondetion)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TremsCondetionsService);
//# sourceMappingURL=trems-condetions.service.js.map