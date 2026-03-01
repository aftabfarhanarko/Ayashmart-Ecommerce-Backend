import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SslInitiateDto } from './dto/ssl-initiate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemUser } from '../systemuser/entities/systemuser.entity';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly http: HttpService,
    @InjectRepository(SystemUser)
    private readonly systemUserRepo: Repository<SystemUser>,
  ) {}

  async initiateSslPayment(dto: SslInitiateDto) {
    const initUrl = process.env.SSL_INIT_URL;
    const payload = {
      store_id: process.env.SSL_STORE_ID,
      store_passwd: process.env.SSL_STORE_PASSWORD,
      total_amount: dto.amount,
      currency: dto.currency || 'BDT',
      tran_id: dto.orderId,
      success_url: process.env.SSL_SUCCESS_URL,
      fail_url: process.env.SSL_FAIL_URL,
      cancel_url: process.env.SSL_CANCEL_URL,
      emi_option: 0,
      cus_name: dto.customerName,
      cus_email: dto.customerEmail,
      cus_phone: dto.customerPhone,
      cus_add1: dto.customerAddress || '',
      shipping_method: 'NO',
      product_category: 'General',
      product_profile: 'general',
    };

    if (!initUrl) {
      throw new Error('SSL_INIT_URL is not defined');
    }
    const response = await firstValueFrom(this.http.post(initUrl, payload));
    return response.data;
  }

  async validateSslPayment(valId: string) {
    const validateUrl = process.env.SSL_VALIDATION_URL;
    const params = {
      store_id: process.env.SSL_STORE_ID,
      store_passwd: process.env.SSL_STORE_PASSWORD,
      val_id: valId,
    };
    if (!validateUrl) {
      throw new Error('SSL_VALIDATION_URL is not defined');
    }
    const response = await firstValueFrom(this.http.get(validateUrl, { params }));
    return response.data;
  }

  async processPaymentSuccess(valId: string, paymentData: any) {
    const tranId = paymentData?.tran_id;
    if (!tranId) return null;

    // Try to find the user by ID (assuming tran_id is the user ID)
    // Or if tran_id starts with a prefix, parse it.
    // For now, we assume tran_id IS the system user ID (as per common pattern in this codebase)
    const userId = Number(tranId);
    if (!userId || isNaN(userId)) {
      console.error(`[PaymentsService] Invalid transaction ID format: ${tranId}`);
      return null;
    }

    try {
      const user = await this.systemUserRepo.findOne({ where: { id: userId } });
      if (user) {
        user.isActive = true;
        
        // Update payment info if exists
        if (!user.paymentInfo) {
          user.paymentInfo = {};
        }
        user.paymentInfo.paymentstatus = 'paid';
        user.paymentInfo.paymentmethod = paymentData.card_type || 'SSLCommerz';
        user.paymentInfo.amount = Number(paymentData.amount || 0);
        
        await this.systemUserRepo.save(user);
        
        console.log(`[PaymentsService] Automatically activated user ${user.id} (${user.email}) after successful payment`);
        
        return {
           success: true,
           userId: user.id,
           companyId: user.companyId
        };
      } else {
        console.warn(`[PaymentsService] User not found for transaction ID: ${tranId}`);
      }
    } catch (error) {
      console.error(`[PaymentsService] Error activating user:`, error);
    }
    
    return {
      success: false,
      message: 'User activation failed'
    };
  }

  async createCashOnDelivery(orderId: string, amount: number, address: string) {
    return {
      orderId,
      amount,
      address,
      paymentMethod: 'COD',
      status: 'pending',
      message: 'Cash on delivery placed. Collect payment on delivery.',
    };
  }
}