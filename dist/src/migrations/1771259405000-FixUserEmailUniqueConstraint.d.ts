import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class FixUserEmailUniqueConstraint1771259405000 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
