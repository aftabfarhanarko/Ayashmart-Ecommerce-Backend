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
exports.FraudcheckerService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const request_context_service_1 = require("../common/services/request-context.service");
const setting_service_1 = require("../setting/setting.service");
let FraudcheckerService = class FraudcheckerService {
    constructor(usersService, requestContextService, settingService) {
        this.usersService = usersService;
        this.requestContextService = requestContextService;
        this.settingService = settingService;
    }
    async checkUserRisk(userId) {
        const companyId = this.requestContextService.getCompanyId();
        const user = await this.usersService.findOne(userId, companyId);
        const reasons = [];
        let score = 0;
        const successful = user.successfulOrdersCount ?? 0;
        const cancelled = user.cancelledOrdersCount ?? 0;
        const total = successful + cancelled;
        if (user.isBanned) {
            reasons.push('User is banned');
            score = 100;
        }
        else {
            const cancelRate = total > 0 ? cancelled / total : 0;
            if (cancelRate >= 0.5) {
                reasons.push('High cancellation rate (>= 50%)');
                score += 70;
            }
            else if (cancelRate >= 0.2) {
                reasons.push('Elevated cancellation rate (>= 20%)');
                score += 40;
            }
            if (successful === 0 && cancelled > 0) {
                reasons.push('Only cancellations, no successful orders');
                score += 30;
            }
            if (score > 100)
                score = 100;
        }
        return {
            userId: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone ?? null,
            isBanned: user.isBanned,
            riskScore: score,
            riskReasons: reasons,
            successfulOrders: successful,
            cancelledOrders: cancelled,
            totalOrders: total,
        };
    }
    async checkUserRiskByPhone(phone) {
        const companyId = this.requestContextService.getCompanyId();
        const user = await this.usersService.findByPhone(phone, companyId);
        return this.checkUserRisk(user.id);
    }
    async checkUserRiskByEmail(email) {
        const companyId = this.requestContextService.getCompanyId();
        const user = await this.usersService.findByEmail(email, companyId);
        return this.checkUserRisk(user.id);
    }
    async checkUserRiskByName(name) {
        const companyId = this.requestContextService.getCompanyId();
        const users = await this.usersService.findByName(name, companyId);
        if (!users.length)
            throw new common_1.NotFoundException('No users found with that name');
        const results = await Promise.all(users.map((u) => this.checkUserRisk(u.id)));
        return { count: results.length, results };
    }
    async flagUser(userId, reason) {
        const companyId = this.requestContextService.getCompanyId();
        return this.usersService.ban(userId, companyId, reason);
    }
    async unflagUser(userId) {
        const companyId = this.requestContextService.getCompanyId();
        return this.usersService.unban(userId, companyId);
    }
    async checkByPhoneExternal(phone) {
        const companyId = this.requestContextService.getCompanyId();
        const apiKey = await this.settingService.getFraudCheckerApiKey(companyId);
        const url = apiKey
            ? `https://fraudchecker.link/api/search.php?phone=${encodeURIComponent(phone)}&api_key=${encodeURIComponent(apiKey)}`
            : `https://fraudchecker.link/free-fraud-checker-bd/api/search.php?phone=${encodeURIComponent(phone)}`;
        let res;
        try {
            res = await fetch(url);
        }
        catch (err) {
            throw new common_1.BadGatewayException('Failed to reach fraudchecker.link API');
        }
        if (!res.ok) {
            throw new common_1.BadGatewayException(`External API returned status ${res.status}`);
        }
        const json = await res.json();
        return json;
    }
};
exports.FraudcheckerService = FraudcheckerService;
exports.FraudcheckerService = FraudcheckerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        request_context_service_1.RequestContextService,
        setting_service_1.SettingService])
], FraudcheckerService);
//# sourceMappingURL=fraudchecker.service.js.map