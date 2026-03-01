import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { BroadcastEmailDto } from './dto/broadcast-email.dto';
import { BroadcastSmsDto } from './dto/broadcast-sms.dto';
import { NotificationType } from './entities/notification.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RequestContextService } from '../common/services/request-context.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly requestContextService: RequestContextService,
  ) {}

  @Get()
  async getAllNotifications(
    @Query('type') type?: NotificationType,
    @Query('companyId') queryCompanyId?: string,
  ) {
    // Use query parameter if provided, otherwise get from request context
    const companyId = queryCompanyId || this.requestContextService.getCompanyId();
    const notifications = await this.notificationsService.getNotificationsByCompanyAndType(
      companyId,
      type,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Notifications retrieved successfully',
      data: notifications,
    };
  }

  @Patch('mark-all-read')
  async markAllAsRead(@Query('companyId') queryCompanyId?: string) {
    const companyId = queryCompanyId || this.requestContextService.getCompanyId();
    await this.notificationsService.markAllAsRead(companyId);
    return {
      statusCode: HttpStatus.OK,
      message: 'All notifications marked as read',
    };
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Query('companyId') queryCompanyId?: string,
  ) {
    const companyId = queryCompanyId || this.requestContextService.getCompanyId();
    const notification = await this.notificationsService.markAsRead(id, companyId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Notification marked as read',
      data: notification,
    };
  }

  @Get('order-created')
  async getOrderCreatedNotifications(@Query('companyId') queryCompanyId?: string) {
    // Use query parameter if provided, otherwise get from request context
    const companyId = queryCompanyId || this.requestContextService.getCompanyId();
    const notifications = await this.notificationsService.getNotificationsByCompanyAndType(
      companyId,
      NotificationType.ORDER_CREATED,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Order created notifications retrieved successfully',
      data: notifications,
    };
  }

  @Get('order-status')
  async getOrderStatusNotifications(@Query('companyId') queryCompanyId?: string) {
    const companyId = queryCompanyId || this.requestContextService.getCompanyId();
    // Get all order-related notifications
    const allNotifications = await this.notificationsService.getNotificationsByCompany(companyId);
    const orderNotifications = allNotifications.filter(n => 
      n.type.startsWith('order_') || n.type === NotificationType.PAYMENT_RECEIVED || n.type === NotificationType.PAYMENT_FAILED
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Order status notifications retrieved successfully',
      data: orderNotifications,
    };
  }

  @Get('new-customers')
  async getNewCustomerNotifications(@Query('companyId') queryCompanyId?: string) {
    const companyId = queryCompanyId || this.requestContextService.getCompanyId();
    const notifications = await this.notificationsService.getNotificationsByCompanyAndType(
      companyId,
      NotificationType.NEW_CUSTOMER,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'New customer notifications retrieved successfully',
      data: notifications,
    };
  }

  @Get('low-stock')
  async getLowStockNotifications(@Query('companyId') queryCompanyId?: string) {
    const companyId = queryCompanyId || this.requestContextService.getCompanyId();
    const allNotifications = await this.notificationsService.getNotificationsByCompany(companyId);
    const stockNotifications = allNotifications.filter(n => 
      n.type === NotificationType.LOW_STOCK || n.type === NotificationType.OUT_OF_STOCK
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Stock notifications retrieved successfully',
      data: stockNotifications,
    };
  }

  @Post('email/customers')
  @HttpCode(HttpStatus.ACCEPTED)
  async broadcastEmail(@Body() dto: BroadcastEmailDto) {
    const summary = await this.notificationsService.sendEmailToCustomers(dto);
    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Customer email broadcast triggered',
      data: summary,
    };
  }

  @Post('sms/customers')
  @HttpCode(HttpStatus.ACCEPTED)
  async broadcastSms(@Body() dto: BroadcastSmsDto) {
    const summary = await this.notificationsService.sendSmsToCustomers(dto);
    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Customer SMS broadcast triggered',
      data: summary,
    };
  }
}

