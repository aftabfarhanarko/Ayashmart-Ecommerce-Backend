"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPendingStatusToProducts1744000000000 = void 0;
class AddPendingStatusToProducts1744000000000 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TYPE "tbl_products_status_enum" ADD VALUE IF NOT EXISTS 'pending';
    `);
    }
    async down(queryRunner) {
        console.warn('Rollback: Cannot remove "pending" from enum safely in PostgreSQL. Manual intervention required.');
    }
}
exports.AddPendingStatusToProducts1744000000000 = AddPendingStatusToProducts1744000000000;
//# sourceMappingURL=1744000000000-AddPendingStatusToProducts.js.map