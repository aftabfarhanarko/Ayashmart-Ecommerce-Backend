import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio'; // Twilio import

@Injectable()
export class VoiceService {
  private client: twilio.Twilio | null = null;
  private readonly logger = new Logger(VoiceService.name);

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    // Only instantiate if credentials exist
    if (accountSid && authToken) {
      this.client = twilio(accountSid, authToken);
    } else {
      this.logger.warn('Twilio credentials missing. Voice API calls will not be executed.');
    }
  }

  async makeOrderConfirmationCall(customerPhone: string, orderId: number, companyId: string) {
    if (!this.client) {
      this.logger.warn(`Skipped order confirmation call for ${customerPhone} (Order: ${orderId}) because Twilio is not configured.`);
      return null;
    }

    try {
      const serverBaseUrl = this.configService.get<string>('SERVER_BASE_URL');
      const fromNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');

      if (!serverBaseUrl || !fromNumber) {
         this.logger.error('SERVER_BASE_URL or TWILIO_PHONE_NUMBER is not set in .env.');
         return null;
      }

      // Prepend + if not present (simplified fallback)
      let formattedPhone = customerPhone.replace(/\s+/g, '');
      if (!formattedPhone.startsWith('+')) {
        // Assume Bangladesh prefix if local number starts with 01
        if (formattedPhone.startsWith('01')) {
          formattedPhone = '+88' + formattedPhone;
        } else {
          formattedPhone = '+' + formattedPhone;
        }
      }

      this.logger.log(`Initiating call to ${formattedPhone} for order: ${orderId}`);

      const call = await this.client.calls.create({
        to: formattedPhone,
        from: fromNumber,
        url: `${serverBaseUrl}/api/voice/ivr?orderId=${orderId}&companyId=${companyId}`,
      });

      this.logger.log(`Call initiated successfully. SID: ${call.sid}`);
      return call.sid;
    } catch (error: any) {
      this.logger.error(`Failed to initiate call: ${error.message}`);
    }
  }
}
