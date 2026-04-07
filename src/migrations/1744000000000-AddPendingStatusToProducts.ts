import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPendingStatusToProducts1744000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add 'pending' to the product status enum in PostgreSQL
    await queryRunner.query(`
      ALTER TYPE "tbl_products_status_enum" ADD VALUE IF NOT EXISTS 'pending';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Note: PostgreSQL does not support removing enum values without recreating the type.
    // To rollback, you would need to recreate the enum and update the column.
    // This is intentionally left as a no-op for safety.
    console.warn(
      'Rollback: Cannot remove "pending" from enum safely in PostgreSQL. Manual intervention required.',
    );
  }
}
