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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const systemuser_entity_1 = require("../systemuser/entities/systemuser.entity");
let PaymentsService = class PaymentsService {
    constructor(http, systemUserRepo) {
        this.http = http;
        this.systemUserRepo = systemUserRepo;
    }
    async initiateSslPayment(dto) {
        const initUrl = process.env.SSL_INIT_URL;
        const payload = {
            store_id: process.env.SSL_STORE_ID,
            store_passwd: process.env.SSL_STORE_PASSWORD,
            total_amount: dto.amount,
            currency: dto.currency || 'BDT',
            tran_id: dto.orderId,
            success_url: process.env.SSL_SUCCESS_URL,
            fail_url: process.env.SSL_FAIL_URL,
            cancel_url: process.env.SSL_CANCEL_URL,
            emi_option: 0,
            cus_name: dto.customerName,
            cus_email: dto.customerEmail,
            cus_phone: dto.customerPhone,
            cus_add1: dto.customerAddress || '',
            shipping_method: 'NO',
            product_category: 'General',
            product_profile: 'general',
        };
        if (!initUrl) {
            throw new Error('SSL_INIT_URL is not defined');
        }
        const response = await (0, rxjs_1.firstValueFrom)(this.http.post(initUrl, payload));
        return response.data;
    }
    async validateSslPayment(valId) {
        const validateUrl = process.env.SSL_VALIDATION_URL;
        const params = {
            store_id: process.env.SSL_STORE_ID,
            store_passwd: process.env.SSL_STORE_PASSWORD,
            val_id: valId,
        };
        if (!validateUrl) {
            throw new Error('SSL_VALIDATION_URL is not defined');
        }
        const response = await (0, rxjs_1.firstValueFrom)(this.http.get(validateUrl, { params }));
        return response.data;
    }
    async processPaymentSuccess(valId, paymentData) {
        const tranId = paymentData?.tran_id;
        if (!tranId)
            return null;
        const userId = Number(tranId);
        if (!userId || isNaN(userId)) {
            console.error(`[PaymentsService] Invalid transaction ID format: ${tranId}`);
            return null;
        }
        try {
            const user = await this.systemUserRepo.findOne({ where: { id: userId } });
            if (user) {
                user.isActive = true;
                if (!user.paymentInfo) {
                    user.paymentInfo = {};
                }
                user.paymentInfo.paymentstatus = 'paid';
                user.paymentInfo.paymentmethod = paymentData.card_type || 'SSLCommerz';
                user.paymentInfo.amount = Number(paymentData.amount || 0);
                await this.systemUserRepo.save(user);
                console.log(`[PaymentsService] Automatically activated user ${user.id} (${user.email}) after successful payment`);
                return {
                    success: true,
                    userId: user.id,
                    companyId: user.companyId
                };
            }
            else {
                console.warn(`[PaymentsService] User not found for transaction ID: ${tranId}`);
            }
        }
        catch (error) {
            console.error(`[PaymentsService] Error activating user:`, error);
        }
        return {
            success: false,
            message: 'User activation failed'
        };
    }
    async createCashOnDelivery(orderId, amount, address) {
        return {
            orderId,
            amount,
            address,
            paymentMethod: 'COD',
            status: 'pending',
            message: 'Cash on delivery placed. Collect payment on delivery.',
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(systemuser_entity_1.SystemUser)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        typeorm_2.Repository])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map