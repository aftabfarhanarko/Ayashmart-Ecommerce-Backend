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
exports.CompanyIdService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const systemuser_entity_1 = require("../../systemuser/entities/systemuser.entity");
let CompanyIdService = class CompanyIdService {
    constructor(systemUserRepo) {
        this.systemUserRepo = systemUserRepo;
    }
    async generateNextCompanyId() {
        const lastUser = await this.systemUserRepo
            .createQueryBuilder('user')
            .where('user.companyId IS NOT NULL')
            .andWhere('user.companyId LIKE :pattern', { pattern: 'COMP-%' })
            .orderBy('user.id', 'DESC')
            .getOne();
        let nextNumber = 1;
        if (lastUser && lastUser.companyId) {
            const match = lastUser.companyId.match(/COMP-(\d+)/);
            if (match && match[1]) {
                nextNumber = parseInt(match[1], 10) + 1;
            }
        }
        return `COMP-${nextNumber.toString().padStart(6, '0')}`;
    }
};
exports.CompanyIdService = CompanyIdService;
exports.CompanyIdService = CompanyIdService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(systemuser_entity_1.SystemUser)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CompanyIdService);
//# sourceMappingURL=company-id.service.js.map