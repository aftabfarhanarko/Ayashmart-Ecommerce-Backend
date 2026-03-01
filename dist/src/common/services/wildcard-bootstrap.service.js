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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WildcardBootstrapService = void 0;
const common_1 = require("@nestjs/common");
const wildcard_domain_service_1 = require("./wildcard-domain.service");
let WildcardBootstrapService = class WildcardBootstrapService {
    constructor(wildcardDomainService) {
        this.wildcardDomainService = wildcardDomainService;
    }
    onApplicationBootstrap() {
        const autoSetup = process.env.WILDCARD_AUTO_SETUP === 'true';
        if (!autoSetup)
            return;
        if (!this.wildcardDomainService.isConfigured()) {
            return;
        }
        this.wildcardDomainService
            .setupWildcard()
            .then((r) => {
            if (r.success) {
                console.log('✅ Wildcard DNS setup completed on startup');
            }
            else {
                console.warn('⚠️ Wildcard DNS setup had issues:', r.errors);
            }
        })
            .catch((err) => console.error('Wildcard startup setup error:', err?.message));
    }
};
exports.WildcardBootstrapService = WildcardBootstrapService;
exports.WildcardBootstrapService = WildcardBootstrapService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [wildcard_domain_service_1.WildcardDomainService])
], WildcardBootstrapService);
//# sourceMappingURL=wildcard-bootstrap.service.js.map