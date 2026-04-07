import { Response } from 'express';
import { OrderService } from '../orders/orders.service';
export declare class VoiceController {
    private readonly orderService;
    private readonly logger;
    constructor(orderService: OrderService);
    generateIvr(orderId: string, companyId: string, res: Response): Response<any, Record<string, any>>;
    handleInput(orderId: string, companyId: string, digits: string, res: Response): Promise<void>;
}
