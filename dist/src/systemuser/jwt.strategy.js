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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const systemuser_service_1 = require("./systemuser.service");
const users_service_1 = require("../users/users.service");
const superadmin_service_1 = require("../superadmin/superadmin.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(systemuserService, usersService, superadminService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'change-me-in-prod',
        });
        this.systemuserService = systemuserService;
        this.usersService = usersService;
        this.superadminService = superadminService;
    }
    async validate(payload) {
        const userId = payload.userId || payload.sub;
        if (!userId) {
            return null;
        }
        const role = payload.role;
        const companyId = payload.companyId;
        if (role === 'customer' && companyId) {
            try {
                const customer = await this.usersService.findOne(Number(userId), companyId);
                if (!customer || !customer.isActive || customer.isBanned) {
                    return null;
                }
                return {
                    userId: customer.id,
                    companyId: customer.companyId,
                    email: customer.email,
                    name: customer.name,
                    role: customer.role ?? 'customer',
                };
            }
            catch {
                return null;
            }
        }
        if (role === 'SUPER_ADMIN') {
            try {
                const superadmin = await this.superadminService.findOne(Number(userId));
                if (!superadmin || superadmin.isActive === false) {
                    return null;
                }
                return {
                    userId: superadmin.id,
                    email: superadmin.email,
                    role: 'SUPER_ADMIN',
                };
            }
            catch {
                return null;
            }
        }
        try {
            const user = await this.systemuserService.findOne(Number(userId));
            if (!user || !user.isActive) {
                return null;
            }
            return {
                userId: user.id,
                companyId: user.companyId,
                email: user.email,
                permissions: user.permissions || [],
                role: user.role,
            };
        }
        catch {
            return null;
        }
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [systemuser_service_1.SystemuserService,
        users_service_1.UsersService,
        superadmin_service_1.SuperadminService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map