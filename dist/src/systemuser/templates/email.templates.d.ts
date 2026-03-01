export declare class EmailTemplates {
    static formatFeatureName(feature: string): string;
    static getUserUpdateTemplate(user: any, newPassword?: string): string;
    static getWelcomeEmailTemplate(user: any, password: string): string;
    static getPasswordResetTemplate(user: any, resetLink: string): string;
    static getInvoicePaidStoreReadyTemplate(user: any, password: string, subdomainUrl: string): string;
    static getPackageUpgradeTemplate(user: any, oldPackage: any, newPackage: any): string;
}
