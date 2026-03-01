export declare const TXT_VERIFICATION_PREFIX = "_squadcart-verify";
export declare class DnsVerificationService {
    private readonly logger;
    getTxtRecordHost(apexDomain: string): string;
    verifyTxtOwnership(apexDomain: string, expectedToken: string): Promise<boolean>;
    verifyCnamePointsTo(hostname: string, expectedCnameTarget: string): Promise<boolean>;
}
