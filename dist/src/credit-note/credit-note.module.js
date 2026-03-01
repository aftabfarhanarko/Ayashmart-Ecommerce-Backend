"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditNoteModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const credit_note_controller_1 = require("./credit-note.controller");
const credit_note_service_1 = require("./credit-note.service");
const credit_note_entity_1 = require("./entities/credit-note.entity");
let CreditNoteModule = class CreditNoteModule {
};
exports.CreditNoteModule = CreditNoteModule;
exports.CreditNoteModule = CreditNoteModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([credit_note_entity_1.CreditNote])],
        controllers: [credit_note_controller_1.CreditNoteController],
        providers: [credit_note_service_1.CreditNoteService],
        exports: [credit_note_service_1.CreditNoteService],
    })
], CreditNoteModule);
//# sourceMappingURL=credit-note.module.js.map