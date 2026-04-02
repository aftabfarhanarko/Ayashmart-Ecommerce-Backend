import { Inject, Injectable, NotFoundException, ServiceUnavailableException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { UsersService } from '../users/users.service';
import { BroadcastEmailDto } from './dto/broadcast-email.dto';
import { BroadcastSmsDto } from './dto/broadcast-sms.dto';
import { User } from '../users/entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RequestContextService } from '../common/services/request-context.service';
import { Notification, NotificationType, NotificationChannel } from './entities/notification.entity';

type NotificationChannelType = 'email' | 'sms';

@Injectable()
export class NotificationsService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        @Inject('MAILER_TRANSPORT')
        private readonly mailer: { sendMail: (message: unknown) => Promise<{ id?: string }> },
        private readonly httpService: HttpService,
        private readonly requestContextService: RequestContextService,
        @InjectRepository(Notification)
        private readonly notificationRepo: Repository<Notification>,
    ) { }

    async sendEmailToCustomers(dto: BroadcastEmailDto) {
        const companyId = this.requestContextService.getCompanyId();
        const recipients = (
            await this.usersService.findCustomers(companyId, {
                ids: dto.customerIds,
            })
        ).filter((user) => !!user.email);

        if (!recipients.length) {
            throw new NotFoundException('No customers with a valid email address were found');
        }

        const fromAddress = process.env.SMTP_FROM ?? process.env.SMTP_USER;

        const results = await Promise.allSettled(
            recipients.map((user) => {
                const personalizedBody = dto.body.replace(/{{\s*name\s*}}/gi, user.name ?? 'there');
                return this.mailer.sendMail({
                    companyId,
                    from: fromAddress,
                    to: user.email,
                    subject: dto.subject,
                    text: personalizedBody,
                    html: dto.html,
                });
            }),
        );

        return this.buildSummary('email', recipients, results);
    }

    async sendSmsToCustomers(dto: BroadcastSmsDto) {
        const companyId = this.requestContextService.getCompanyId();
        const recipients = (await this.usersService.findCustomers(companyId)).filter((user) => !!user.phone);

        if (!recipients.length) {
            throw new NotFoundException('No customers with a phone number were found');
        }

        const config = this.getSmsConfig();

        const results = await Promise.allSettled(
            recipients.map((user) => this.dispatchSms(config, user.phone as string, dto.message)),
        );

        return this.buildSummary('sms', recipients, results);
    }

    private buildSummary(
        channel: NotificationChannelType,
        recipients: User[],
        results: PromiseSettledResult<unknown>[],
    ) {
        const failed: Array<{ userId: number; contact?: string; reason: string }> = [];

        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                failed.push({
                    userId: recipients[index].id,
                    contact: channel === 'email' ? recipients[index].email : recipients[index].phone,
                    reason: result.reason?.message ?? 'Unknown error',
                });
            }
        });

        return {
            channel,
            totalRecipients: recipients.length,
            delivered: recipients.length - failed.length,
            failed: failed.length,
            failedRecipients: failed,
        };
    }

    private getSmsConfig() {
        const apiUrl = process.env.SMS_API_URL;
        const apiKey = process.env.SMS_API_KEY;
        const senderId = process.env.SMS_SENDER_ID ?? 'ECOMM';

        if (!apiUrl || !apiKey) {
            throw new ServiceUnavailableException('SMS provider is not configured');
        }

        return { apiUrl, apiKey, senderId };
    }

    private async dispatchSms(
        config: { apiUrl: string; apiKey: string; senderId: string },
        to: string,
        message: string,
    ) {
        await firstValueFrom(
            this.httpService.post(
                config.apiUrl,
                {
                    to,
                    message,
                    senderId: config.senderId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${config.apiKey}`,
                    },
                },
            ),
        );
    }

    async sendOwnerEmail(ownerEmail: string, subject: string, body: string, companyId?: string, orderId?: number) {
        try {
            const fromAddress = process.env.SMTP_FROM ?? process.env.SMTP_USER;
            
            const info = await this.mailer.sendMail({
                companyId,
                from: fromAddress,
                to: ownerEmail,
                subject,
                text: body,
            });

            if (process.env.NODE_ENV !== 'production') {
                console.log('Owner email sent:', info?.id);
            }

            // Save notification record
            if (companyId) {
                await this.saveNotification({
                    companyId,
                    type: NotificationType.ORDER_CREATED,
                    channel: NotificationChannel.EMAIL,
                    recipient: ownerEmail,
                    subject,
                    message: body,
                    status: 'sent',
                    orderId,
                });
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to send owner email:', error);
            
            // Save failed notification record
            if (companyId) {
                await this.saveNotification({
                    companyId,
                    type: NotificationType.ORDER_CREATED,
                    channel: NotificationChannel.EMAIL,
                    recipient: ownerEmail,
                    subject,
                    message: body,
                    status: 'failed',
                    orderId,
                    metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
                });
            }
            
            return { success: false, error };
        }
    }

    async sendOwnerWhatsApp(ownerWhatsapp: string, message: string, companyId?: string, orderId?: number) {
        try {
            const config = this.getSmsConfig();
            await this.dispatchSms(config, ownerWhatsapp, message);
            
            if (process.env.NODE_ENV !== 'production') {
                console.log('Owner WhatsApp sent to:', ownerWhatsapp);
            }

            // Save notification record
            if (companyId) {
                await this.saveNotification({
                    companyId,
                    type: NotificationType.ORDER_CREATED,
                    channel: NotificationChannel.WHATSAPP,
                    recipient: ownerWhatsapp,
                    message,
                    status: 'sent',
                    orderId,
                });
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to send owner WhatsApp:', error);
            
            // Save failed notification record
            if (companyId) {
                await this.saveNotification({
                    companyId,
                    type: NotificationType.ORDER_CREATED,
                    channel: NotificationChannel.WHATSAPP,
                    recipient: ownerWhatsapp,
                    message,
                    status: 'failed',
                    orderId,
                    metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
                });
            }
            
            return { success: false, error };
        }
    }

    private async saveNotification(data: {
        companyId: string;
        type: NotificationType;
        channel: NotificationChannel;
        recipient: string;
        message: string;
        status: string;
        subject?: string;
        orderId?: number;
        metadata?: Record<string, any>;
    }) {
        try {
            const notification = this.notificationRepo.create(data);
            await this.notificationRepo.save(notification);
        } catch (error) {
            console.error('Failed to save notification record:', error);
        }
    }

    /** Save ORDER_CREATED notification for navbar - called on every new order */
    async saveOrderCreatedForNavbar(companyId: string, orderId: number, subject: string, message: string) {
        await this.saveNotification({
            companyId,
            type: NotificationType.ORDER_CREATED,
            channel: NotificationChannel.EMAIL,
            recipient: 'store',
            subject,
            message,
            status: 'sent',
            orderId,
        });
    }

    /** Save NEW_CUSTOMER notification when a customer registers */
    async saveNewCustomerNotification(companyId: string, customerName: string, customerEmail?: string) {
        await this.saveNotification({
            companyId,
            type: NotificationType.NEW_CUSTOMER,
            channel: NotificationChannel.EMAIL,
            recipient: 'store',
            subject: 'New Customer Registered',
            message: `New customer ${customerName}${customerEmail ? ` (${customerEmail})` : ''} has registered.`,
            status: 'sent',
        });
    }

    /** Save CUSTOMER_UPDATED notification when a customer profile is updated */
    async saveCustomerUpdatedNotification(companyId: string, customerName: string, customerId: number) {
        await this.saveNotification({
            companyId,
            type: NotificationType.CUSTOMER_UPDATED,
            channel: NotificationChannel.EMAIL,
            recipient: 'store',
            subject: 'Customer Profile Updated',
            message: `Customer ${customerName} (ID: ${customerId}) has updated their profile.`,
            status: 'sent',
            metadata: { customerId },
        });
    }

    /** Save PRODUCT_ADDED notification when a new product is created */
    async saveProductAddedNotification(companyId: string, productName: string, productId: number, sku?: string) {
        await this.saveNotification({
            companyId,
            type: NotificationType.PRODUCT_ADDED,
            channel: NotificationChannel.EMAIL,
            recipient: 'store',
            subject: 'New Product Added',
            message: `New product "${productName}"${sku ? ` (${sku})` : ''} has been added to your catalog.`,
            status: 'sent',
            metadata: { productId },
        });
    }

    /** Save PRODUCT_UPDATED notification when a product is updated */
    async saveProductUpdatedNotification(companyId: string, productName: string, productId: number, sku?: string) {
        await this.saveNotification({
            companyId,
            type: NotificationType.PRODUCT_UPDATED,
            channel: NotificationChannel.EMAIL,
            recipient: 'store',
            subject: 'Product Updated',
            message: `Product "${productName}"${sku ? ` (${sku})` : ''} has been updated.`,
            status: 'sent',
            metadata: { productId },
        });
    }

    /** Save LOW_STOCK notification when product stock is low (<= 5) */
    async saveLowStockNotification(companyId: string, productName: string, productId: number, stock: number, sku?: string) {
        await this.saveNotification({
            companyId,
            type: NotificationType.LOW_STOCK,
            channel: NotificationChannel.EMAIL,
            recipient: 'store',
            subject: 'Low Stock Alert',
            message: `Product "${productName}"${sku ? ` (${sku})` : ''} is running low on stock. Current stock: ${stock}.`,
            status: 'sent',
            metadata: { productId, stock },
        });
    }

    /** Save OUT_OF_STOCK notification when product stock reaches 0 */
    async saveOutOfStockNotification(companyId: string, productName: string, productId: number, sku?: string) {
        await this.saveNotification({
            companyId,
            type: NotificationType.OUT_OF_STOCK,
            channel: NotificationChannel.EMAIL,
            recipient: 'store',
            subject: 'Out of Stock Alert',
            message: `Product "${productName}"${sku ? ` (${sku})` : ''} is out of stock. Please restock.`,
            status: 'sent',
            metadata: { productId },
        });
    }

    async getNotificationsByCompanyAndType(companyId: string, type?: NotificationType) {
        const where: any = { companyId };
        if (type) {
            where.type = type;
        }

        return this.notificationRepo.find({
            where,
            order: { createdAt: 'DESC' },
        });
    }

    async getNotificationsByCompany(companyId: string) {
        return this.notificationRepo.find({
            where: { companyId },
            order: { createdAt: 'DESC' },
        });
    }

    async markAsRead(id: number, companyId: string) {
        const notification = await this.notificationRepo.findOne({
            where: { id, companyId },
        });
        if (!notification) return null;
        notification.isRead = true;
        await this.notificationRepo.save(notification);
        return notification;
    }

    async markAllAsRead(companyId: string) {
        await this.notificationRepo.update(
            { companyId, isRead: false },
            { isRead: true },
        );
        return { success: true };
    }

    /** Delete notifications older than 24 hours */
    async deleteOlderThan24Hours(): Promise<number> {
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const result = await this.notificationRepo.delete({
            createdAt: LessThan(cutoff),
        });
        return result.affected ?? 0;
    }
}

