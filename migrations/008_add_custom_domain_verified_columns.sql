-- Add custom domain auto-verification columns to system_users
-- Run this if you get: column SystemUser.custom_domain_verified_at does not exist

ALTER TABLE system_users ADD COLUMN IF NOT EXISTS custom_domain_verified_at TIMESTAMP;
ALTER TABLE system_users ADD COLUMN IF NOT EXISTS ssl_provisioned_at TIMESTAMP;
ALTER TABLE system_users ADD COLUMN IF NOT EXISTS cloudflare_hostname_id varchar(255);
