import {MigrationInterface, QueryRunner} from "typeorm";

export class admin1640609546711 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE audit_action AS ENUM('set_user_type', 'ban_user', 'delete_user_content')`);
        await queryRunner.query(`
            CREATE TABLE audit (
                "id" bigint PRIMARY KEY NOT NULL DEFAULT id_generator(),
                "createdAt" timestamp with time zone NOT NULL DEFAULT CURRENT_DATE,
                "id_auth" bigint NOT NULL,
                "action" audit_action NOT NULL,
                "id_affected_user" bigint NOT NULL,
                "detail" char(64) NOT NULL,
                "note" varchar(255) NOT NULL DEFAULT '',
                CONSTRAINT "fk_audit_id_auth" FOREIGN KEY ("id_auth") REFERENCES auth ("id"),
                CONSTRAINT "fk_audit_id_affected_user" FOREIGN KEY ("id_affected_user") REFERENCES auth ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE auth_rights (
                "id_auth" bigint NOT NULL,
                "grant" boolean DEFAULT false,
                "audit" boolean DEFAULT false,
                "user_list" boolean DEFAULT false,
                "document_list" boolean DEFAULT false,
                "ban_user" boolean DEFAULT false,
                "delete_content" boolean DEFAULT false,
                CONSTRAINT "fk_auth_rights_id_auth" FOREIGN KEY ("id_auth") REFERENCES auth ("id")
            )
        `);

        // Create admin superuser for discordID 60468942044405760 ("Niv")
        const users = await queryRunner.query(`SELECT "id" FROM "auth" WHERE "provider" = $1 AND "id_provider" = $2`, ["discord", "60468942044405760"]);
        const {id} = users[0];
        await queryRunner.query(`
            INSERT INTO "auth_rights" ("id_auth", "grant", "audit", "user_list", "document_list", "ban_user", "delete_content")
            VALUES ($1, true, true, true, true, true, true)
        `, [id]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE audit CASCADE`);
        await queryRunner.query(`DROP TABLE auth_rights CASCADE`);
        await queryRunner.query(`DROP TYPE audit_action`);
    }
}
