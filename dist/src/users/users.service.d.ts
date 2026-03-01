import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from '../notifications/notifications.service';
export declare class UsersService {
    private readonly userRepo;
    private readonly dataSource;
    private readonly jwtService;
    private readonly notificationsService;
    private get repository();
    constructor(userRepo: Repository<User>, dataSource: DataSource, jwtService: JwtService, notificationsService: NotificationsService);
    private hashPassword;
    create(createUserDto: CreateUserDto, companyId: string): Promise<User>;
    findAll(companyId: string, filters?: {
        isBanned?: boolean;
        isActive?: boolean;
        successfulOrders?: 'has' | 'none';
        cancelledOrders?: 'has' | 'none';
    }): Promise<User[]>;
    findOne(id: number, companyId: string): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto, companyId: string): Promise<User>;
    ban(id: number, companyId: string, reason?: string): Promise<User>;
    unban(id: number, companyId: string): Promise<User>;
    remove(id: number, companyId: string): Promise<void>;
    findByEmail(email: string, companyId: string): Promise<User>;
    findByName(name: string, companyId: string): Promise<User[]>;
    findByPhone(phone: string, companyId: string): Promise<User>;
    findCustomers(companyId: string, filter?: {
        ids?: number[];
        includeInactive?: boolean;
    }): Promise<User[]>;
    login(email: string, password: string, companyId: string): Promise<{
        accessToken: string;
        user: any;
    }>;
}
