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
exports.DeliveryConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let DeliveryConfigService = class DeliveryConfigService {
    constructor(configService) {
        this.configService = configService;
    }
    get pathao() {
        return {
            clientId: this.configService.get('PATHAO_CLIENT_ID') || '',
            clientSecret: this.configService.get('PATHAO_CLIENT_SECRET') || '',
            baseUrl: this.configService.get('PATHAO_BASE_URL') || 'https://api.pathao.com/v1',
            grantType: this.configService.get('PATHAO_GRANT_TYPE') || 'client_credentials',
        };
    }
    get steadfast() {
        return {
            apiKey: this.configService.get('STEADFAST_API_KEY') || '',
            secretKey: this.configService.get('STEADFAST_SECRET_KEY') || '',
            baseUrl: this.configService.get('STEADFAST_BASE_URL') || 'https://portal.steadfast.com.bd/api/v1',
        };
    }
    get redx() {
        const sandbox = this.configService.get('REDX_SANDBOX') !== 'false';
        return {
            token: this.configService.get('REDX_TOKEN') || '',
            baseUrl: sandbox
                ? 'https://sandbox.redx.com.bd/v1.0.0-beta'
                : this.configService.get('REDX_BASE_URL') || 'https://openapi.redx.com.bd/v1.0.0-beta',
            sandbox,
        };
    }
    isPathaoConfigured() {
        const config = this.pathao;
        return !!config.clientId && !!config.clientSecret;
    }
    isSteadfastConfigured() {
        const config = this.steadfast;
        return !!config.apiKey && !!config.secretKey;
    }
    isRedXConfigured() {
        const config = this.redx;
        return !!config.token;
    }
};
exports.DeliveryConfigService = DeliveryConfigService;
exports.DeliveryConfigService = DeliveryConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DeliveryConfigService);
//# sourceMappingURL=delivery.config.js.map