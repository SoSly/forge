import {MigrationInterface, QueryRunner} from "typeorm";

export class createUserTables1592796597062 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE auth (
                "id" bigint PRIMARY KEY NOT NULL DEFAULT id_generator(),
                "username" varchar(255) NOT NULL,
                "provider" varchar(255) NOT NULL,
                "id_provider" varchar(255) NOT NULL,
                "avatar" varchar(255),
                "locale" char(5),
                CONSTRAINT "idx_provider" UNIQUE ("provider", "id_provider")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE user_settings (
                "id" bigint PRIMARY KEY NOT NULL DEFAULT id_generator(),
                "id_auth" bigint,
                "darkmode" boolean DEFAULT true,
                CONSTRAINT "fk_user_settings_id_auth" FOREIGN KEY ("id_auth") REFERENCES auth ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE user_settings CASCADE`);
        await queryRunner.query(`DROP TABLE auth CASCADE`);
    }
}
