import {MigrationInterface, QueryRunner} from "typeorm";

export class createDocumentTables1592799324435 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE document_type AS ENUM('markdown','stylesheet');`);
        await queryRunner.query(`
            CREATE TABLE document (
                "id" bigint PRIMARY KEY NOT NULL DEFAULT id_generator(),
                "name" varchar(255) NOT NULL,
                "type" document_type NOT NULL DEFAULT 'markdown',
                "createdAt" DATE NOT NULL DEFAULT CURRENT_DATE,
                "updatedAt" DATE NOT NULL DEFAULT CURRENT_DATE,
                "id_auth" bigint NOT NULL,
                "id_folder" bigint NOT NULL,
                CONSTRAINT "fk_document_id_auth" FOREIGN KEY ("id_auth") REFERENCES auth ("id"),
                CONSTRAINT "fk_document_id_folder" FOREIGN KEY ("id_folder") REFERENCES folder ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE document_content (
                "id" bigint PRIMARY KEY DEFAULT id_generator(),
                "id_document" bigint NOT NULL,
                "contents" text NOT NULL DEFAULT '',
                CONSTRAINT "fk_document_content_document_id" FOREIGN KEY ("id_document") REFERENCES document ("id")
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE document_content CASCADE`);
        await queryRunner.query(`DROP TABLE document CASCADE`);
        await queryRunner.query(`DROP TYPE document_type`);
    }

}
