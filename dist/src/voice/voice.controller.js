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
var VoiceController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceController = void 0;
const common_1 = require("@nestjs/common");
const twilio = require("twilio");
const orders_service_1 = require("../orders/orders.service");
let VoiceController = VoiceController_1 = class VoiceController {
    constructor(orderService) {
        this.orderService = orderService;
        this.logger = new common_1.Logger(VoiceController_1.name);
    }
    generateIvr(orderId, companyId, res) {
        const twiml = new twilio.twiml.VoiceResponse();
        if (!orderId || !companyId) {
            this.logger.warn('Received IVR request without orderId or companyId');
            twiml.say('Information missing. Goodbye.');
            res.type('text/xml');
            return res.send(twiml.toString());
        }
        const gather = twiml.gather({
            numDigits: 1,
            action: `/api/voice/handle-input?orderId=${orderId}&companyId=${companyId}`,
            method: 'POST',
            timeout: 10
        });
        gather.say({ language: 'en-US' }, 'Thank you for your order. Press 1 to confirm the order. Press 2 to cancel the order.');
        twiml.say('We didn\'t receive any input. Goodbye!');
        res.type('text/xml');
        res.send(twiml.toString());
    }
    async handleInput(orderId, companyId, digits, res) {
        const twiml = new twilio.twiml.VoiceResponse();
        try {
            const numericOrderId = Number(orderId);
            if (digits === '1') {
                this.logger.log(`Order ${orderId} confirmed via IVR.`);
                await this.orderService.processOrder(numericOrderId, companyId);
                twiml.say('Your order has been confirmed and is now processing. Thank you!');
            }
            else if (digits === '2') {
                this.logger.log(`Order ${orderId} cancelled via IVR.`);
                await this.orderService.cancelOrder(numericOrderId, companyId, 'Cancelled via Voice IVR');
                twiml.say('Your order has been cancelled successfully.');
            }
            else {
                twiml.say('Invalid input. Goodbye.');
            }
        }
        catch (error) {
            this.logger.error(`Error handling DTMF input for order ${orderId}: ${error.message}`);
            twiml.say('Sorry, an error occurred while updating your order.');
        }
        res.type('text/xml');
        res.send(twiml.toString());
    }
};
exports.VoiceController = VoiceController;
__decorate([
    (0, common_1.Post)('ivr'),
    __param(0, (0, common_1.Query)('orderId')),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], VoiceController.prototype, "generateIvr", null);
__decorate([
    (0, common_1.Post)('handle-input'),
    __param(0, (0, common_1.Query)('orderId')),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, common_1.Body)('Digits')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], VoiceController.prototype, "handleInput", null);
exports.VoiceController = VoiceController = VoiceController_1 = __decorate([
    (0, common_1.Controller)('api/voice'),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => orders_service_1.OrderService))),
    __metadata("design:paramtypes", [orders_service_1.OrderService])
], VoiceController);
//# sourceMappingURL=voice.controller.js.map