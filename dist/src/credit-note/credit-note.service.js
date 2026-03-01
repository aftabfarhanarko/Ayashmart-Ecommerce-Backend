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
exports.CreditNoteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const credit_note_entity_1 = require("./entities/credit-note.entity");
let CreditNoteService = class CreditNoteService {
    constructor(creditNoteRepository) {
        this.creditNoteRepository = creditNoteRepository;
    }
    async create(createCreditNoteDto) {
        const creditNote = this.creditNoteRepository.create(createCreditNoteDto);
        return await this.creditNoteRepository.save(creditNote);
    }
    async findAllByCompany(companyId) {
        return await this.creditNoteRepository.find({
            where: { companyId },
            relations: ['customer', 'relatedInvoice'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, companyId) {
        const creditNote = await this.creditNoteRepository.findOne({
            where: { id, companyId },
            relations: ['customer', 'relatedInvoice'],
        });
        if (!creditNote) {
            throw new common_1.NotFoundException(`Credit Note with ID ${id} not found`);
        }
        return creditNote;
    }
    async remove(id, companyId) {
        const creditNote = await this.findOne(id, companyId);
        await this.creditNoteRepository.softRemove(creditNote);
    }
};
exports.CreditNoteService = CreditNoteService;
exports.CreditNoteService = CreditNoteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(credit_note_entity_1.CreditNote)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CreditNoteService);
//# sourceMappingURL=credit-note.service.js.map