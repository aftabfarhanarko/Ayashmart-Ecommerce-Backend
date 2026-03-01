export declare const generatePaymentConfirmationEmail: (customerName: string, invoiceNumber: string, totalAmount: number, paidAmount: number, bankName: string, paymentDate: string, companyName: string) => string;
export declare const generatePaymentRejectionEmail: (customerName: string, invoiceNumber: string, bankName: string, amount: number, reason?: string, companyName?: string) => string;
