"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const databaseUrl = process.env.DATABASE_URL || '';
const useStrictSsl = /sslmode=(require|verify-ca|verify-full)/i.test(databaseUrl);
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: databaseUrl,
    ssl: useStrictSsl ? { rejectUnauthorized: true } : false,
    synchronize: false,
    logging: true,
    entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
    migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
    migrationsTableName: 'typeorm_migrations',
});
//# sourceMappingURL=data-source.js.map