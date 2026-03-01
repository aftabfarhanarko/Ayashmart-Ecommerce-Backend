// UsersService
import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, QueryFailedError, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  private get repository(): Repository<User> {
    // Use injected repository if available, otherwise get from DataSource
    return this.userRepo || this.dataSource.getRepository(User);
  }

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  private hashPassword(password: string, salt: string): string {
    return crypto.createHmac('sha256', salt).update(password).digest('hex');
  }

  async create(createUserDto: CreateUserDto, companyId: string): Promise<User> {
    try {
      if (!companyId) {
        throw new BadRequestException('CompanyId is required');
      }

      const existing = await this.repository.findOne({
        where: { email: createUserDto.email, companyId }
      });
      if (existing) throw new BadRequestException('Email already exists');

      const userData: any = {
        name: createUserDto.name,
        email: createUserDto.email,
        phone: createUserDto.phone,
        address: createUserDto.address,
        role: (createUserDto as any).role ?? 'customer',
        isActive: (createUserDto as any).isActive ?? true,
        companyId,
      };

      // If password is provided, hash it
      if (createUserDto.password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = this.hashPassword(createUserDto.password, salt);
        userData.passwordSalt = salt;
        userData.passwordHash = hash;
      }

      const user = this.repository.create(userData) as unknown as User;
      const saved = await this.repository.save(user);
      // Notify store owner when a new customer registers (non-blocking for client)
      if (saved.role === 'customer') {
        try {
          await this.notificationsService.saveNewCustomerNotification(
            companyId,
            saved.name ?? 'Unknown',
            saved.email ?? undefined,
          );
        } catch (e) {
          console.error('Failed to save new customer notification:', e);
        }
      }
      return saved;
    } catch (error) {
      // Don't re-throw BadRequestException (already a 400 error)
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      // Handle DB unique/email errors gracefully instead of generic 500
      if (error instanceof QueryFailedError) {
        const pgError = error as any;
        const errorCode = pgError.code;
        const message = pgError.detail || pgError.message || '';
        
        // PostgreSQL unique constraint violation error code
        if (errorCode === '23505' || message?.toLowerCase().includes('unique') || message?.toLowerCase().includes('duplicate')) {
          throw new BadRequestException('Email already exists');
        }
      }
      
      console.error('Error creating user:', error);
      // Log full error details for debugging
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
        console.error('Error message:', error.message);
      }
      throw new InternalServerErrorException(`Failed to register user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findAll(
    companyId: string,
    filters?: {
      isBanned?: boolean;
      isActive?: boolean;
      successfulOrders?: 'has' | 'none';
      cancelledOrders?: 'has' | 'none';
    },
  ): Promise<User[]> {
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
    } else if (filters?.successfulOrders === 'none') {
      qb.andWhere('user.successfulOrdersCount = 0');
    }
    if (filters?.cancelledOrders === 'has') {
      qb.andWhere('user.cancelledOrdersCount > 0');
    } else if (filters?.cancelledOrders === 'none') {
      qb.andWhere('user.cancelledOrdersCount = 0');
    }

    return qb.getMany();
  }

  async findOne(id: number, companyId: string): Promise<User> {
    const user = await this.repository.findOne({ where: { id, companyId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, companyId: string): Promise<User> {
    const user = await this.findOne(id, companyId);

    const dto: Partial<UpdateUserDto> = updateUserDto ?? {};

    if (dto.email && dto.email !== user.email) {
      const exists = await this.repository.findOne({
        where: { email: dto.email, companyId }
      });
      if (exists) throw new BadRequestException('Email already exists');
    }

    if (dto.name !== undefined) user.name = dto.name as any;
    if (dto.email !== undefined) user.email = dto.email as any;
    if (dto.phone !== undefined) user.phone = dto.phone as any;
    if (dto.address !== undefined) user.address = dto.address as any;
    if (dto.district !== undefined) user.district = dto.district as any;

    if (dto.role !== undefined) user.role = dto.role as any;
    if (dto.isActive !== undefined) user.isActive = dto.isActive as any;

    const saved = await this.repository.save(user);
    // Notify store owner when a customer profile is updated
    if (saved.role === 'customer') {
      try {
        await this.notificationsService.saveCustomerUpdatedNotification(
          companyId,
          saved.name ?? 'Unknown',
          saved.id,
        );
      } catch (e) {
        console.error('Failed to save customer updated notification:', e);
      }
    }
    return saved;
  }

  // Add ban/unban methods
  async ban(id: number, companyId: string, reason?: string): Promise<User> {
    const user = await this.findOne(id, companyId);
    if (user.isBanned) throw new BadRequestException('User already banned');

    user.isBanned = true;
    user.bannedAt = new Date();
    user.banReason = reason ?? null;

    return this.repository.save(user);
  }

  async unban(id: number, companyId: string): Promise<User> {
    const user = await this.findOne(id, companyId);
    if (!user.isBanned) throw new BadRequestException('User is not banned');

    user.isBanned = false;
    user.bannedAt = null;
    user.banReason = null;

    return this.repository.save(user);
  }

  async remove(id: number, companyId: string): Promise<void> {
    const user = await this.findOne(id, companyId);
    const result = await this.repository.softDelete(id);
    if (!result.affected) throw new NotFoundException('User not found');
  }

  // Add lookups for FraudChecker
  async findByEmail(email: string, companyId: string): Promise<User> {
    const user = await this.repository.findOne({ where: { email, companyId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByName(name: string, companyId: string): Promise<User[]> {
    return this.repository.find({ where: { name, companyId } });
  }

  // Add lookup by phone number for FraudChecker
  async findByPhone(phone: string, companyId: string): Promise<User> {
    const user = await this.repository.findOne({ where: { phone, companyId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findCustomers(companyId: string, filter?: { ids?: number[]; includeInactive?: boolean }): Promise<User[]> {
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

  async login(email: string, password: string, companyId: string) {
    const user = await this.repository.findOne({ 
      where: { email, companyId } 
    });
    if (!user) throw new NotFoundException('Invalid credentials');

    if (!user.passwordHash || !user.passwordSalt) {
      throw new BadRequestException('Password not set for this user');
    }

    const hash = this.hashPassword(password, user.passwordSalt);
    if (hash !== user.passwordHash) throw new NotFoundException('Invalid credentials');

    if (!user.isActive) throw new BadRequestException('User account is inactive');
    if (user.isBanned) throw new BadRequestException('User account is banned');

    const payload = {
      sub: user.id,
      userId: user.id,
      email: user.email,
      name: user.name,
      companyId: user.companyId,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const { passwordHash, passwordSalt, ...safe } = user as any;
    return { accessToken, user: safe };
  }
}
