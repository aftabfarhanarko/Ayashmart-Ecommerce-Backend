import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { BroadcastEmailDto } from './dto/broadcast-email.dto';
import { BroadcastSmsDto } from './dto/broadcast-sms.dto';
import { HttpService } from '@nestjs/axios';
import { RequestContextService } from '../common/services/request-context.service';
import { Notification, NotificationType } from './entities/notification.entity';
type NotificationChannelType = 'email' | 'sms';
export declare class NotificationsService {
    private readonly usersService;
    private readonly mailer;
    private readonly httpService;
    private readonly requestContextService;
    private readonly notificationRepo;
    constructor(usersService: UsersService, mailer: {
        sendMail: (message: unknown) => Promise<{
            id?: string;
        }>;
    }, httpService: HttpService, requestContextService: RequestContextService, notificationRepo: Repository<Notification>);
    sendEmailToCustomers(dto: BroadcastEmailDto): Promise<{
        channel: NotificationChannelType;
        totalRecipients: number;
        delivered: number;
        failed: number;
        failedRecipients: {
            userId?: number;
            contact?: string;
            reason: string;
        }[];
    }>;
    sendSmsToCustomers(dto: BroadcastSmsDto): Promise<{
        channel: NotificationChannelType;
        totalRecipients: number;
        delivered: number;
        failed: number;
        failedRecipients: {
            userId: number;
            contact?: string;
            reason: string;
        }[];
    }>;
    private buildSummary;
    private getSmsConfig;
    private dispatchSms;
    sendOwnerEmail(ownerEmail: string, subject: string, body: string, companyId?: string, orderId?: number): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    sendOwnerWhatsApp(ownerWhatsapp: string, message: string, companyId?: string, orderId?: number): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    private saveNotification;
    saveOrderCreatedForNavbar(companyId: string, orderId: number, subject: string, message: string): Promise<void>;
    saveNewCustomerNotification(companyId: string, customerName: string, customerEmail?: string): Promise<void>;
    saveCustomerUpdatedNotification(companyId: string, customerName: string, customerId: number): Promise<void>;
    saveProductAddedNotification(companyId: string, productName: string, productId: number, sku?: string): Promise<void>;
    saveProductUpdatedNotification(companyId: string, productName: string, productId: number, sku?: string): Promise<void>;
    saveLowStockNotification(companyId: string, productName: string, productId: number, stock: number, sku?: string): Promise<void>;
    saveOutOfStockNotification(companyId: string, productName: string, productId: number, sku?: string): Promise<void>;
    getNotificationsByCompanyAndType(companyId: string, type?: NotificationType): Promise<Notification[]>;
    getNotificationsByCompany(companyId: string): Promise<Notification[]>;
    markAsRead(id: number, companyId: string): Promise<Notification>;
    markAllAsRead(companyId: string): Promise<{
        success: boolean;
    }>;
    deleteOlderThan24Hours(): Promise<number>;
}
export {};
