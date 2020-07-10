import {MigrationInterface, QueryRunner} from "typeorm";

export class storageLimits1594365832799 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE account_type AS ENUM('free','unlimited')`);
        await queryRunner.query(`ALTER TABLE "auth" ADD COLUMN "type" account_type NOT NULL DEFAULT 'free'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE account_type`);
    }

}
