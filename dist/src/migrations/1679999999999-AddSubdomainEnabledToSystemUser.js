"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSubdomainEnabledToSystemUser1679999999999 = void 0;
class AddSubdomainEnabledToSystemUser1679999999999 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "system_users"
      ADD COLUMN "subdomainEnabled" boolean NOT NULL DEFAULT true
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "system_users"
      DROP COLUMN "subdomainEnabled"
    `);
    }
}
exports.AddSubdomainEnabledToSystemUser1679999999999 = AddSubdomainEnabledToSystemUser1679999999999;
//# sourceMappingURL=1679999999999-AddSubdomainEnabledToSystemUser.js.map