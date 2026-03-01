/**
 * Custom domain lifecycle states for fully automatic domain flow.
 * - pending_dns: User added domain; waiting for TXT (and optionally CNAME) DNS.
 * - verified: TXT verification passed; DNS ownership confirmed.
 * - ssl_provisioning: Cloudflare (or platform) is issuing/provisioning SSL.
 * - active: Domain is live with SSL; traffic is routed to the store.
 * - failed: Verification or SSL failed; user may retry or remove domain.
 */
export type CustomDomainStatus =
  | 'pending'
  | 'pending_dns'
  | 'verified'
  | 'ssl_provisioning'
  | 'active'
  | 'failed';

export const CUSTOM_DOMAIN_STATUS_VALUES: CustomDomainStatus[] = [
  'pending',
  'pending_dns',
  'verified',
  'ssl_provisioning',
  'active',
  'failed',
];
