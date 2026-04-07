import { Controller, Post, Res, Body, Query, forwardRef, Inject, Logger } from '@nestjs/common';
import { Response } from 'express';
import * as twilio from 'twilio';
import { OrderService } from '../orders/orders.service';

@Controller('api/voice')
export class VoiceController {
  private readonly logger = new Logger(VoiceController.name);

  constructor(
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService
  ) {}
  
  @Post('ivr')
  generateIvr(@Query('orderId') orderId: string, @Query('companyId') companyId: string, @Res() res: Response) {
    const twiml = new twilio.twiml.VoiceResponse();
    
    if (!orderId || !companyId) {
      this.logger.warn('Received IVR request without orderId or companyId');
      twiml.say('Information missing. Goodbye.');
      res.type('text/xml');
      return res.send(twiml.toString());
    }

    const gather = twiml.gather({
      numDigits: 1,
      action: `/api/voice/handle-input?orderId=${orderId}&companyId=${companyId}`,
      method: 'POST',
      timeout: 10
    });

    gather.say(
      { language: 'en-US' },
      'Thank you for your order. Press 1 to confirm the order. Press 2 to cancel the order.'
    );

    twiml.say('We didn\'t receive any input. Goodbye!');

    res.type('text/xml');
    res.send(twiml.toString());
  }

  @Post('handle-input')
  async handleInput(
    @Query('orderId') orderId: string, 
    @Query('companyId') companyId: string,
    @Body('Digits') digits: string, 
    @Res() res: Response
  ) {
    const twiml = new twilio.twiml.VoiceResponse();

    try {
      const numericOrderId = Number(orderId);

      if (digits === '1') {
        this.logger.log(`Order ${orderId} confirmed via IVR.`);
        await this.orderService.processOrder(numericOrderId, companyId);
        twiml.say('Your order has been confirmed and is now processing. Thank you!');
      } else if (digits === '2') {
        this.logger.log(`Order ${orderId} cancelled via IVR.`);
        await this.orderService.cancelOrder(numericOrderId, companyId, 'Cancelled via Voice IVR');
        twiml.say('Your order has been cancelled successfully.');
      } else {
        twiml.say('Invalid input. Goodbye.');
      }
    } catch (error: any) {
      this.logger.error(`Error handling DTMF input for order ${orderId}: ${error.message}`);
      twiml.say('Sorry, an error occurred while updating your order.');
    }

    res.type('text/xml');
    res.send(twiml.toString());
  }
}
