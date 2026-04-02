import { OrderService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(dto: CreateOrderDto, companyIdFromQuery?: string, companyIdFromToken?: string, req?: any): Promise<{
        statusCode: number;
        message: string;
        data: {
            order: import("./entities/order.entity").Order;
            payment: any;
        };
    }>;
    createIncomplete(dto: CreateOrderDto, companyIdFromQuery?: string, companyIdFromToken?: string, orderId?: string): Promise<{
        statusCode: number;
        message: string;
        data: import("./entities/order.entity").Order;
    }>;
    convert(id: number, companyId: string, req?: any): Promise<{
        statusCode: number;
        message: string;
        data: import("./entities/order.entity").Order;
    }>;
    getMyOrders(userId: number, companyId: string): Promise<{
        statusCode: number;
        message: string;
        data: import("./entities/order.entity").Order[];
    }>;
    getByCustomer(id: number, companyId: string): Promise<{
        statusCode: number;
        message: string;
        data: import("./entities/order.entity").Order[];
    }>;
    findAll(companyId: string, resellerIdFromQuery?: string, req?: any): Promise<{
        statusCode: number;
        data: import("./entities/order.entity").Order[];
    }>;
    getStats(companyId: string): Promise<{
        statusCode: number;
        data: {
            total: number;
            pending: number;
            processing: number;
            paid: number;
            shipped: number;
            delivered: number;
            cancelled: number;
            refunded: number;
            incomplete: number;
            totalRevenue: number;
            unpaidCount: number;
        };
    }>;
    findOne(id: number, companyId: string): Promise<{
        statusCode: number;
        data: import("./entities/order.entity").Order;
    }>;
    process(id: number, companyId: string, req?: any): Promise<{
        statusCode: number;
        message: string;
        data: import("./entities/order.entity").Order;
    }>;
    complete(id: number, body: {
        paymentRef?: string;
    }, companyId: string, req?: any): Promise<{
        statusCode: number;
        message: string;
        data: import("./entities/order.entity").Order;
    }>;
    deliver(id: number, body: {
        userId?: number;
        permissions?: string[];
        comment?: string;
        markAsPaid?: boolean;
    }, companyId: string, req?: any): Promise<{
        statusCode: number;
        message: string;
        data: import("./entities/order.entity").Order;
    }>;
    cancel(id: number, body: {
        comment?: string;
    }, companyId: string, req?: any): Promise<{
        message: string;
        statusCode: number;
    }>;
    success(id: number, companyId: string, req?: any): Promise<{
        statusCode: number;
        message: string;
        data: import("./entities/order.entity").Order;
    }>;
    ship(id: number, body: {
        trackingId?: string;
        provider?: string;
    }, companyId: string, req?: any): Promise<{
        statusCode: number;
        message: string;
        data: import("./entities/order.entity").Order;
    }>;
    partialPayment(id: number, body: {
        amount: number;
        paymentRef?: string;
    }, companyId: string, req?: any): Promise<{
        statusCode: number;
        message: string;
        data: import("./entities/order.entity").Order;
    }>;
    refund(id: number, companyId: string, req?: any): Promise<{
        statusCode: number;
        message: string;
        data: import("./entities/order.entity").Order;
    }>;
    barcodeScan(body: {
        trackingId: string;
    }, companyId: string, req?: any): Promise<{
        statusCode: number;
        message: string;
        data: {
            orderId: number;
            trackingId: string;
            message: string;
        };
    }>;
    delete(id: number, companyId: string, req?: any): Promise<{
        statusCode: number;
        message: string;
    }>;
}
