import { Injectable, Logger } from '@nestjs/common';
import * as dns from 'dns';
import { promisify } from 'util';

const resolveTxt = promisify(dns.resolveTxt);
const resolveCname = promisify(dns.resolveCname);
const resolve4 = promisify(dns.resolve4);

/** TXT record host for ownership verification (e.g. _innowavecart-verify.mystore.com) */
export const TXT_VERIFICATION_PREFIX = '_innowavecart-verify';

@Injectable()
export class DnsVerificationService {
  private readonly logger = new Logger(DnsVerificationService.name);

  /**
   * Returns the TXT record host the user must add for domain verification.
   * Example: for "mystore.com" returns "_innowavecart-verify"
   * The full record name at DNS is _innowavecart-verify.mystore.com
   */
  getTxtRecordHost(apexDomain: string): string {
    return TXT_VERIFICATION_PREFIX;
  }

  /**
   * Verifies that the TXT record for domain ownership is present and matches the expected token.
   * Resolves TXT for _innowavecart-verify.<apexDomain> and checks if any value equals expectedToken.
   */
  async verifyTxtOwnership(apexDomain: string, expectedToken: string): Promise<boolean> {
    const recordName = `${TXT_VERIFICATION_PREFIX}.${apexDomain}`.toLowerCase();
    try {
      const records = await resolveTxt(recordName);
      if (!Array.isArray(records) || records.length === 0) {
        return false;
      }
      // TXT can be array of strings per record (e.g. [ ['value'] ])
      for (const r of records) {
        const value = Array.isArray(r) ? r.join('') : String(r);
        if (value.trim() === expectedToken.trim()) {
          return true;
        }
      }
      return false;
    } catch (err: any) {
      if (err?.code === 'ENOTFOUND' || err?.code === 'ENODATA') {
        return false;
      }
      this.logger.warn(`TXT verification lookup failed for ${recordName}: ${err?.message}`);
      return false;
    }
  }

  /**
   * Optional: verify CNAME points to our target (e.g. www.mystore.com -> shops.myplatform.com).
   * Used for additional confidence; TXT is the authoritative ownership check.
   */
  async verifyCnamePointsTo(hostname: string, expectedCnameTarget: string): Promise<boolean> {
    const expected = expectedCnameTarget.toLowerCase().replace(/\.$/, '');
    try {
      const cnames = await resolveCname(hostname);
      if (!Array.isArray(cnames) || cnames.length === 0) {
        return false;
      }
      return cnames.some((c) => c.toLowerCase().replace(/\.$/, '') === expected);
    } catch {
      return false;
    }
  }
}
