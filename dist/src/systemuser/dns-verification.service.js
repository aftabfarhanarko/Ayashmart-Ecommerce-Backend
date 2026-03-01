"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DnsVerificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsVerificationService = exports.TXT_VERIFICATION_PREFIX = void 0;
const common_1 = require("@nestjs/common");
const dns = require("dns");
const util_1 = require("util");
const resolveTxt = (0, util_1.promisify)(dns.resolveTxt);
const resolveCname = (0, util_1.promisify)(dns.resolveCname);
const resolve4 = (0, util_1.promisify)(dns.resolve4);
exports.TXT_VERIFICATION_PREFIX = '_squadcart-verify';
let DnsVerificationService = DnsVerificationService_1 = class DnsVerificationService {
    constructor() {
        this.logger = new common_1.Logger(DnsVerificationService_1.name);
    }
    getTxtRecordHost(apexDomain) {
        return exports.TXT_VERIFICATION_PREFIX;
    }
    async verifyTxtOwnership(apexDomain, expectedToken) {
        const recordName = `${exports.TXT_VERIFICATION_PREFIX}.${apexDomain}`.toLowerCase();
        try {
            const records = await resolveTxt(recordName);
            if (!Array.isArray(records) || records.length === 0) {
                return false;
            }
            for (const r of records) {
                const value = Array.isArray(r) ? r.join('') : String(r);
                if (value.trim() === expectedToken.trim()) {
                    return true;
                }
            }
            return false;
        }
        catch (err) {
            if (err?.code === 'ENOTFOUND' || err?.code === 'ENODATA') {
                return false;
            }
            this.logger.warn(`TXT verification lookup failed for ${recordName}: ${err?.message}`);
            return false;
        }
    }
    async verifyCnamePointsTo(hostname, expectedCnameTarget) {
        const expected = expectedCnameTarget.toLowerCase().replace(/\.$/, '');
        try {
            const cnames = await resolveCname(hostname);
            if (!Array.isArray(cnames) || cnames.length === 0) {
                return false;
            }
            return cnames.some((c) => c.toLowerCase().replace(/\.$/, '') === expected);
        }
        catch {
            return false;
        }
    }
};
exports.DnsVerificationService = DnsVerificationService;
exports.DnsVerificationService = DnsVerificationService = DnsVerificationService_1 = __decorate([
    (0, common_1.Injectable)()
], DnsVerificationService);
//# sourceMappingURL=dns-verification.service.js.map