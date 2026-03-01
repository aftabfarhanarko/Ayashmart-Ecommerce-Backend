import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Fixes email unique constraint to be per-company instead of global.
 * Changes from unique constraint on email column to composite unique index on (email, companyId).
 */
export class FixUserEmailUniqueConstraint1771259405000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Find and drop any existing unique constraint/index on email column
    // PostgreSQL creates unique constraints as indexes
    const indexes = await queryRunner.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'tbl_users' 
      AND indexdef LIKE '%UNIQUE%' 
      AND indexdef LIKE '%email%'
    `);
    
    for (const index of indexes) {
      await queryRunner.query(`DROP INDEX IF EXISTS "${index.indexname}";`);
    }
    
    // Also try common constraint names that might exist
    await queryRunner.query(`
      DROP INDEX IF EXISTS "tbl_users_email_key";
    `);
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_tbl_users_email";
    `);
    
    // Create composite unique index on (email, companyId)
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_tbl_users_email_companyId" 
      ON "tbl_users" ("email", "companyId");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the composite unique index
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_tbl_users_email_companyId";
    `);
    
    // Restore the original unique constraint on email column
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "tbl_users_email_key" 
      ON "tbl_users" ("email");
    `);
  }
}
