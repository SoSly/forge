import {MigrationInterface, QueryRunner} from "typeorm";

export class folderTimestamps1640589057008 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE document ALTER COLUMN "createdAt" TYPE timestamp with time zone`);
        await queryRunner.query(`ALTER TABLE document ALTER COLUMN "updatedAt" TYPE timestamp with time zone`);

        await queryRunner.query(`ALTER TABLE folder ALTER COLUMN "createdAt" TYPE timestamp with time zone`);
        await queryRunner.query(`ALTER TABLE folder ALTER COLUMN "updatedAt" TYPE timestamp with time zone`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE document ALTER COLUMN "createdAt" TYPE date`);
        await queryRunner.query(`ALTER TABLE document ALTER COLUMN "updatedAt" TYPE date`);

        await queryRunner.query(`ALTER TABLE folder ALTER COLUMN "createdAt" TYPE date`);
        await queryRunner.query(`ALTER TABLE folder ALTER COLUMN "updatedAt" TYPE date`);
    }

}
