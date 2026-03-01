import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Extends custom domain support for fully automatic flow:
 * - Status stored as varchar to support: pending_dns, verified, ssl_provisioning, active, failed
 * - New columns: custom_domain_verified_at, ssl_provisioned_at, cloudflare_hostname_id
 */
export class CustomDomainAutoVerification1739180000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Change enum column to varchar so we can use new status values without DB enum migration
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

  public async down(queryRunner: QueryRunner): Promise<void> {
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
