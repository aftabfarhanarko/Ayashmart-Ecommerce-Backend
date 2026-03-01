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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const jwt_1 = require("@nestjs/jwt");
const crypto = require("crypto");
const notifications_service_1 = require("../notifications/notifications.service");
let UsersService = class UsersService {
    get repository() {
        return this.userRepo || this.dataSource.getRepository(user_entity_1.User);
    }
    constructor(userRepo, dataSource, jwtService, notificationsService) {
        this.userRepo = userRepo;
        this.dataSource = dataSource;
        this.jwtService = jwtService;
        this.notificationsService = notificationsService;
    }
    hashPassword(password, salt) {
        return crypto.createHmac('sha256', salt).update(password).digest('hex');
    }
    async create(createUserDto, companyId) {
        try {
            if (!companyId) {
                throw new common_1.BadRequestException('CompanyId is required');
            }
            const existing = await this.repository.findOne({
                where: { email: createUserDto.email, companyId }
            });
            if (existing)
                throw new common_1.BadRequestException('Email already exists');
            const userData = {
                name: createUserDto.name,
                email: createUserDto.email,
                phone: createUserDto.phone,
                address: createUserDto.address,
                role: createUserDto.role ?? 'customer',
                isActive: createUserDto.isActive ?? true,
                companyId,
            };
            if (createUserDto.password) {
                const salt = crypto.randomBytes(16).toString('hex');
                const hash = this.hashPassword(createUserDto.password, salt);
                userData.passwordSalt = salt;
                userData.passwordHash = hash;
            }
            const user = this.repository.create(userData);
            const saved = await this.repository.save(user);
            if (saved.role === 'customer') {
                try {
                    await this.notificationsService.saveNewCustomerNotification(companyId, saved.name ?? 'Unknown', saved.email ?? undefined);
                }
                catch (e) {
                    console.error('Failed to save new customer notification:', e);
                }
            }
            return saved;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            if (error instanceof typeorm_2.QueryFailedError) {
                const pgError = error;
                const errorCode = pgError.code;
                const message = pgError.detail || pgError.message || '';
                if (errorCode === '23505' || message?.toLowerCase().includes('unique') || message?.toLowerCase().includes('duplicate')) {
                    throw new common_1.BadRequestException('Email already exists');
                }
            }
            console.error('Error creating user:', error);
            if (error instanceof Error) {
                console.error('Error stack:', error.stack);
                console.error('Error message:', error.message);
            }
            throw new common_1.InternalServerErrorException(`Failed to register user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async findAll(companyId, filters) {
        const qb = this.repository
            .createQueryBuilder('user')
            .where('user.companyId = :companyId', { companyId })
            .orderBy('user.id', 'DESC');
        if (filters?.isBanned !== undefined) {
            qb.andWhere('user.isBanned = :isBanned', { isBanned: filters.isBanned });
        }
        if (filters?.isActive !== undefined) {
            qb.andWhere('user.isActive = :isActive', { isActive: filters.isActive });
        }
        if (filters?.successfulOrders === 'has') {
            qb.andWhere('user.successfulOrdersCount > 0');
        }
        else if (filters?.successfulOrders === 'none') {
            qb.andWhere('user.successfulOrdersCount = 0');
        }
        if (filters?.cancelledOrders === 'has') {
            qb.andWhere('user.cancelledOrdersCount > 0');
        }
        else if (filters?.cancelledOrders === 'none') {
            qb.andWhere('user.cancelledOrdersCount = 0');
        }
        return qb.getMany();
    }
    async findOne(id, companyId) {
        const user = await this.repository.findOne({ where: { id, companyId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async update(id, updateUserDto, companyId) {
        const user = await this.findOne(id, companyId);
        const dto = updateUserDto ?? {};
        if (dto.email && dto.email !== user.email) {
            const exists = await this.repository.findOne({
                where: { email: dto.email, companyId }
            });
            if (exists)
                throw new common_1.BadRequestException('Email already exists');
        }
        if (dto.name !== undefined)
            user.name = dto.name;
        if (dto.email !== undefined)
            user.email = dto.email;
        if (dto.phone !== undefined)
            user.phone = dto.phone;
        if (dto.address !== undefined)
            user.address = dto.address;
        if (dto.district !== undefined)
            user.district = dto.district;
        if (dto.role !== undefined)
            user.role = dto.role;
        if (dto.isActive !== undefined)
            user.isActive = dto.isActive;
        const saved = await this.repository.save(user);
        if (saved.role === 'customer') {
            try {
                await this.notificationsService.saveCustomerUpdatedNotification(companyId, saved.name ?? 'Unknown', saved.id);
            }
            catch (e) {
                console.error('Failed to save customer updated notification:', e);
            }
        }
        return saved;
    }
    async ban(id, companyId, reason) {
        const user = await this.findOne(id, companyId);
        if (user.isBanned)
            throw new common_1.BadRequestException('User already banned');
        user.isBanned = true;
        user.bannedAt = new Date();
        user.banReason = reason ?? null;
        return this.repository.save(user);
    }
    async unban(id, companyId) {
        const user = await this.findOne(id, companyId);
        if (!user.isBanned)
            throw new common_1.BadRequestException('User is not banned');
        user.isBanned = false;
        user.bannedAt = null;
        user.banReason = null;
        return this.repository.save(user);
    }
    async remove(id, companyId) {
        const user = await this.findOne(id, companyId);
        const result = await this.repository.softDelete(id);
        if (!result.affected)
            throw new common_1.NotFoundException('User not found');
    }
    async findByEmail(email, companyId) {
        const user = await this.repository.findOne({ where: { email, companyId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async findByName(name, companyId) {
        return this.repository.find({ where: { name, companyId } });
    }
    async findByPhone(phone, companyId) {
        const user = await this.repository.findOne({ where: { phone, companyId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async findCustomers(companyId, filter) {
        const qb = this.repository.createQueryBuilder('user')
            .where('user.role = :role', { role: 'customer' })
            .andWhere('user.companyId = :companyId', { companyId });
        if (!filter?.includeInactive) {
            qb.andWhere('user.isActive = :active', { active: true });
        }
        if (filter?.ids?.length) {
            const ids = Array.from(new Set(filter.ids));
            qb.andWhere('user.id IN (:...ids)', { ids });
        }
        return qb.orderBy('user.id', 'DESC').getMany();
    }
    async login(email, password, companyId) {
        const user = await this.repository.findOne({
            where: { email, companyId }
        });
        if (!user)
            throw new common_1.NotFoundException('Invalid credentials');
        if (!user.passwordHash || !user.passwordSalt) {
            throw new common_1.BadRequestException('Password not set for this user');
        }
        const hash = this.hashPassword(password, user.passwordSalt);
        if (hash !== user.passwordHash)
            throw new common_1.NotFoundException('Invalid credentials');
        if (!user.isActive)
            throw new common_1.BadRequestException('User account is inactive');
        if (user.isBanned)
            throw new common_1.BadRequestException('User account is banned');
        const payload = {
            sub: user.id,
            userId: user.id,
            email: user.email,
            name: user.name,
            companyId: user.companyId,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload);
        const { passwordHash, passwordSalt, ...safe } = user;
        return { accessToken, user: safe };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => notifications_service_1.NotificationsService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        jwt_1.JwtService,
        notifications_service_1.NotificationsService])
], UsersService);
//# sourceMappingURL=users.service.js.map