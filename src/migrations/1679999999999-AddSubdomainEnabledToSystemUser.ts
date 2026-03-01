import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSubdomainEnabledToSystemUser1679999999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "system_users"
      ADD COLUMN "subdomainEnabled" boolean NOT NULL DEFAULT true
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "system_users"
      DROP COLUMN "subdomainEnabled"
    `);
  }
}

