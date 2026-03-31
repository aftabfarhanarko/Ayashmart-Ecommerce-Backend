import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch, Delete, UseGuards, Query, Req, BadRequestException } from "@nestjs/common";
import { OrderService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyIdGuard } from '../common/guards/company-id.guard';
import { CompanyId } from '../common/decorators/company-id.decorator';
import { UserId } from '../common/decorators/user-id.decorator';
import { SystemUserRole } from '../systemuser/system-user-role.enum';
import { Public } from '../common/decorators/public.decorator';

@Controller("orders")
@UseGuards(JwtAuthGuard, CompanyIdGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @Public()
  async create(
    @Body() dto: CreateOrderDto,
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
    @Req() req?: any,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }
    const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
      ? +(req.user.userId || req.user.sub) : undefined;
    const o = await this.orderService.create(dto, companyId, performedByUserId);
    return { statusCode: 201, message: "Order created", data: o };
  }

  @Post("incomplete")
  @Public()
  async createIncomplete(
    @Body() dto: CreateOrderDto,
    @Query('companyId') companyIdFromQuery?: string,
    @CompanyId() companyIdFromToken?: string,
    @Query('orderId') orderId?: string,
  ) {
    const companyId = companyIdFromQuery || companyIdFromToken;
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }
    const o = await this.orderService.createIncomplete(dto, companyId, orderId ? +orderId : undefined);
    return { statusCode: 201, message: "Incomplete order saved", data: o };
  }

  @Patch(":id/convert")
  async convert(
    @Param("id", ParseIntPipe) id: number,
    @CompanyId() companyId: string,
    @Req() req?: any,
  ) {
    const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
      ? +(req.user.userId || req.user.sub) : undefined;
    const o = await this.orderService.convertToRealOrder(id, companyId, performedByUserId);
    return { statusCode: 200, message: "Order converted successfully", data: o };
  }

  @Get('my-orders')
  async getMyOrders(@UserId() userId: number, @CompanyId() companyId: string) {
    const o = await this.orderService.findByCustomerId(userId, companyId);
    return { statusCode: 200, message: 'User orders fetched', data: o };
  }

  @Get('customer/:id')
  async getByCustomer(
    @Param('id', ParseIntPipe) id: number,
    @CompanyId() companyId: string,
  ) {
    const o = await this.orderService.findByCustomerId(id, companyId);
    return { statusCode: 200, message: 'Customer orders fetched', data: o };
  }

  @Get()
  async findAll(
    @CompanyId() companyId: string,
    @Query('resellerId') resellerIdFromQuery?: string,
    @Req() req?: any,
  ) {
    const role: SystemUserRole | undefined = req?.user?.role;
    const numericUserId = +(req?.user?.userId || req?.user?.sub);
    const resellerId =
      role === SystemUserRole.RESELLER
        ? numericUserId
        : resellerIdFromQuery
          ? +resellerIdFromQuery
          : undefined;

    const o = await this.orderService.findAll(companyId, resellerId);
    return { statusCode: 200, data: o };
  }

  @Get('stats')
  async getStats(@CompanyId() companyId: string) {
    const stats = await this.orderService.getStats(companyId);
    return { statusCode: 200, data: stats };
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number, @CompanyId() companyId: string) {
    const o = await this.orderService.findOne(id, companyId);
    return { statusCode: 200, data: o };
  }

  @Patch(":id/process")
  async process(@Param("id", ParseIntPipe) id: number, @CompanyId() companyId: string, @Req() req?: any) {
    const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
      ? +(req.user.userId || req.user.sub) : undefined;
    const o = await this.orderService.processOrder(id, companyId, performedByUserId);
    return { statusCode: 200, message: "Order processing", data: o };
  }

  @Patch(":id/complete")
  async complete(@Param("id", ParseIntPipe) id: number, @Body() body: { paymentRef?: string }, @CompanyId() companyId: string, @Req() req?: any) {
    const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
      ? +(req.user.userId || req.user.sub) : undefined;
    const o = await this.orderService.completeOrder(id, companyId, body?.paymentRef, performedByUserId);
    return { statusCode: 200, message: "Order completed", data: o };
  }

  @Patch(":id/deliver")
  async deliver(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { userId?: number; permissions?: string[]; comment?: string; markAsPaid?: boolean },
    @CompanyId() companyId: string,
    @Req() req?: any,
  ) {
    const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
      ? +(req.user.userId || req.user.sub) : undefined;
    const o = await this.orderService.deliverOrder(id, companyId, body?.userId, body?.permissions, body?.comment, body?.markAsPaid, performedByUserId);
    return { statusCode: 200, message: "Order delivered", data: o };
  }

  @Patch(":id/cancel")
  async cancel(@Param("id", ParseIntPipe) id: number, @Body() body: { comment?: string }, @CompanyId() companyId: string, @Req() req?: any) {
    const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
      ? +(req.user.userId || req.user.sub) : undefined;
    const res = await this.orderService.cancelOrder(id, companyId, body?.comment, performedByUserId);
    return { statusCode: 200, ...res };
  }

  // Add success alias (maps to deliver)
  @Patch(":id/success")
  async success(@Param("id", ParseIntPipe) id: number, @CompanyId() companyId: string, @Req() req?: any) {
    const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
      ? +(req.user.userId || req.user.sub) : undefined;
    const o = await this.orderService.deliverOrder(id, companyId, undefined, undefined, undefined, undefined, performedByUserId);
    return { statusCode: 200, message: "Order success", data: o };
  }


  @Patch(":id/ship")
  async ship(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { trackingId?: string; provider?: string },
    @CompanyId() companyId: string,
    @Req() req?: any,
  ) {
    const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
      ? +(req.user.userId || req.user.sub) : undefined;
    const o = await this.orderService.shipOrder(id, companyId, body?.trackingId, body?.provider, performedByUserId);
    return { statusCode: 200, message: "Order shipped", data: o };
  }

  @Patch(":id/partial-payment")
  async partialPayment(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { amount: number; paymentRef?: string },
    @CompanyId() companyId: string,
    @Req() req?: any,
  ) {
    const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
      ? +(req.user.userId || req.user.sub) : undefined;
    const o = await this.orderService.recordPartialPayment(
      id,
      companyId,
      body?.amount ?? 0,
      body?.paymentRef,
      performedByUserId,
    );
    return { statusCode: 200, message: "Partial payment recorded", data: o };
  }

  @Patch(":id/refund")
  async refund(@Param("id", ParseIntPipe) id: number, @CompanyId() companyId: string, @Req() req?: any) {
    const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
      ? +(req.user.userId || req.user.sub) : undefined;
    const o = await this.orderService.refundOrder(id, companyId, performedByUserId);
    return { statusCode: 200, message: "Order refunded", data: o };
  }

  @Post("barcode-scan")
  async barcodeScan(
    @Body() body: { trackingId: string },
    @CompanyId() companyId: string,
    @Req() req?: any,
  ) {
    const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
      ? +(req.user.userId || req.user.sub) : undefined;
    const res = await this.orderService.recordBarcodeScan(body?.trackingId ?? "", companyId, performedByUserId);
    return { statusCode: 200, message: "Barcode scan recorded", data: res };
  }

  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number, @CompanyId() companyId: string, @Req() req?: any) {
    const performedByUserId = req?.user?.role && ['SUPER_ADMIN', 'SYSTEM_OWNER', 'EMPLOYEE'].includes(req.user.role)
      ? +(req.user.userId || req.user.sub) : undefined;
    await this.orderService.softDelete(id, companyId, performedByUserId);
    return { statusCode: 200, message: "Order moved to trash" };
  }
}
