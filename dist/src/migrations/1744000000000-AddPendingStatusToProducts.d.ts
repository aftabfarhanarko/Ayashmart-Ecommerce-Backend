import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddPendingStatusToProducts1744000000000 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
