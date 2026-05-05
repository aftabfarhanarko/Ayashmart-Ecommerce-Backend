import { HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { BroadcastEmailDto } from './dto/broadcast-email.dto';
import { BroadcastSmsDto } from './dto/broadcast-sms.dto';
import { NotificationType } from './entities/notification.entity';
import { RequestContextService } from '../common/services/request-context.service';
export declare class NotificationsController {
    private readonly notificationsService;
    private readonly requestContextService;
    constructor(notificationsService: NotificationsService, requestContextService: RequestContextService);
    getAllNotifications(type?: NotificationType, queryCompanyId?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/notification.entity").Notification[];
    }>;
    markAllAsRead(queryCompanyId?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    markAsRead(id: number, queryCompanyId?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/notification.entity").Notification;
    }>;
    getOrderCreatedNotifications(queryCompanyId?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/notification.entity").Notification[];
    }>;
    getOrderStatusNotifications(queryCompanyId?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/notification.entity").Notification[];
    }>;
    getNewCustomerNotifications(queryCompanyId?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/notification.entity").Notification[];
    }>;
    getLowStockNotifications(queryCompanyId?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/notification.entity").Notification[];
    }>;
    broadcastEmail(dto: BroadcastEmailDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            channel: "email" | "sms";
            totalRecipients: number;
            delivered: number;
            failed: number;
            failedRecipients: {
                userId?: number;
                contact?: string;
                reason: string;
            }[];
        };
    }>;
    broadcastSms(dto: BroadcastSmsDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            channel: "email" | "sms";
            totalRecipients: number;
            delivered: number;
            failed: number;
            failedRecipients: {
                userId: number;
                contact?: string;
                reason: string;
            }[];
        };
    }>;
}
