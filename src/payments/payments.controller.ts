import { Controller, Post, Body, Get, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { SslInitiateDto } from './dto/ssl-initiate.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('ssl/initiate')
  @HttpCode(HttpStatus.OK)
  async initiateSsl(@Body() dto: SslInitiateDto) {
    const res = await this.paymentsService.initiateSslPayment(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'SSL payment initiated',
      data: res,
    };
  }

  @Get('ssl/callback')
  @Public()
  @HttpCode(HttpStatus.OK)
  async sslCallback(@Query() query: any) {
    if (query?.val_id) {
      const validation = await this.paymentsService.validateSslPayment(query.val_id);
      
      // Process successful payment for account provisioning
      if (validation && (validation.status === 'VALID' || validation.status === 'VALIDATED')) {
         await this.paymentsService.processPaymentSuccess(query.val_id, validation);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'SSL payment validated',
        data: validation,
      };
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'SSL callback received',
      data: query,
    };
  }

  @Post('cod')
  @HttpCode(HttpStatus.CREATED)
  async cashOnDelivery(@Body() body: { orderId: string; amount: number; address: string }) {
    const data = await this.paymentsService.createCashOnDelivery(body.orderId, body.amount, body.address);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Cash on delivery placed',
      data,
    };
  }
}