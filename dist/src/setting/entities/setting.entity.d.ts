export declare class Setting {
    id: number;
    companyName: string;
    logo?: string;
    email: string;
    phone?: string;
    location?: string;
    companyId: string;
    smtpHost?: string;
    smtpPort?: number;
    smtpSecure?: boolean;
    smtpUser?: string;
    smtpPass?: string;
    smtpFrom?: string;
    fraudCheckerApiKey?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
