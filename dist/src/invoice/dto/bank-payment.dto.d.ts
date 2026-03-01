export declare enum BankPaymentStatus {
    PENDING = "pending",
    VERIFIED = "verified",
    REJECTED = "rejected"
}
export declare class BankPaymentDto {
    invoiceId: number;
    bankName: string;
    accLastDigit: string;
    status?: BankPaymentStatus;
}
