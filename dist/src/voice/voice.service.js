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
var VoiceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const twilio = require("twilio");
let VoiceService = VoiceService_1 = class VoiceService {
    constructor(configService) {
        this.configService = configService;
        this.client = null;
        this.logger = new common_1.Logger(VoiceService_1.name);
        const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        if (accountSid && authToken) {
            this.client = twilio(accountSid, authToken);
        }
        else {
            this.logger.warn('Twilio credentials missing. Voice API calls will not be executed.');
        }
    }
    async makeOrderConfirmationCall(customerPhone, orderId, companyId) {
        if (!this.client) {
            this.logger.warn(`Skipped order confirmation call for ${customerPhone} (Order: ${orderId}) because Twilio is not configured.`);
            return null;
        }
        try {
            const serverBaseUrl = this.configService.get('SERVER_BASE_URL');
            const fromNumber = this.configService.get('TWILIO_PHONE_NUMBER');
            if (!serverBaseUrl || !fromNumber) {
                this.logger.error('SERVER_BASE_URL or TWILIO_PHONE_NUMBER is not set in .env.');
                return null;
            }
            let formattedPhone = customerPhone.replace(/\s+/g, '');
            if (!formattedPhone.startsWith('+')) {
                if (formattedPhone.startsWith('01')) {
                    formattedPhone = '+88' + formattedPhone;
                }
                else {
                    formattedPhone = '+' + formattedPhone;
                }
            }
            this.logger.log(`Initiating call to ${formattedPhone} for order: ${orderId}`);
            const call = await this.client.calls.create({
                to: formattedPhone,
                from: fromNumber,
                url: `${serverBaseUrl}/api/voice/ivr?orderId=${orderId}&companyId=${companyId}`,
            });
            this.logger.log(`Call initiated successfully. SID: ${call.sid}`);
            return call.sid;
        }
        catch (error) {
            this.logger.error(`Failed to initiate call: ${error.message}`);
        }
    }
};
exports.VoiceService = VoiceService;
exports.VoiceService = VoiceService = VoiceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], VoiceService);
//# sourceMappingURL=voice.service.js.map