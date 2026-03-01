"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomDomainAutoVerification1739180000000 = void 0;
class CustomDomainAutoVerification1739180000000 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "system_users"
      ALTER COLUMN "customDomainStatus" TYPE varchar(32) USING "customDomainStatus"::text
    `);
        await queryRunner.query(`
      ALTER TABLE "system_users" ALTER COLUMN "customDomainStatus" SET DEFAULT 'pending_dns'
    `);
        await queryRunner.query(`
      ALTER TABLE "system_users"
      ADD COLUMN IF NOT EXISTS "custom_domain_verified_at" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "ssl_provisioned_at" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "cloudflare_hostname_id" varchar(255)
    `);
        await queryRunner.query(`
      UPDATE "system_users"
      SET "customDomainStatus" = 'pending_dns'
      WHERE "customDomain" IS NOT NULL AND "customDomainStatus" = 'pending'
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "system_users"
      DROP COLUMN IF EXISTS "custom_domain_verified_at",
      DROP COLUMN IF EXISTS "ssl_provisioned_at",
      DROP COLUMN IF EXISTS "cloudflare_hostname_id"
    `);
        await queryRunner.query(`
      ALTER TABLE "system_users" ALTER COLUMN "customDomainStatus" SET DEFAULT 'pending'
    `);
    }
}
exports.CustomDomainAutoVerification1739180000000 = CustomDomainAutoVerification1739180000000;
//# sourceMappingURL=1739180000000-CustomDomainAutoVerification.js.map