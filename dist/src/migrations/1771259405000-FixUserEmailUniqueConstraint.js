"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixUserEmailUniqueConstraint1771259405000 = void 0;
class FixUserEmailUniqueConstraint1771259405000 {
    async up(queryRunner) {
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
        await queryRunner.query(`
      DROP INDEX IF EXISTS "tbl_users_email_key";
    `);
        await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_tbl_users_email";
    `);
        await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_tbl_users_email_companyId" 
      ON "tbl_users" ("email", "companyId");
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_tbl_users_email_companyId";
    `);
        await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "tbl_users_email_key" 
      ON "tbl_users" ("email");
    `);
    }
}
exports.FixUserEmailUniqueConstraint1771259405000 = FixUserEmailUniqueConstraint1771259405000;
//# sourceMappingURL=1771259405000-FixUserEmailUniqueConstraint.js.map