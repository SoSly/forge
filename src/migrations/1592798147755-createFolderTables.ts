import {MigrationInterface, QueryRunner} from "typeorm";

export class createDocumentsTables1592798147755 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE folder (
                "id" bigint PRIMARY KEY NOT NULL DEFAULT id_generator(),
                "name" varchar(255) NOT NULL,
                "id_auth" bigint NOT NULL,
                "id_parent" bigint,
                "createdAt" DATE NOT NULL DEFAULT CURRENT_DATE,
                "updatedAt" DATE NOT NULL DEFAULT CURRENT_DATE,
                CONSTRAINT "fk_folder_id_parent" FOREIGN KEY ("id_parent") REFERENCES folder ("id"),
                CONSTRAINT "fk_folder_id_auth" FOREIGN KEY ("id_auth") REFERENCES auth ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE folder_closure (
                "id_ancestor" bigint NOT NULL,
                "id_descendant" bigint NOT NULL,
                CONSTRAINT "idx_folder_closure_ids" UNIQUE ("id_ancestor", "id_descendant"),
                CONSTRAINT "fk_folder_closure_ancestor" FOREIGN KEY ("id_ancestor") REFERENCES folder ("id"),
                CONSTRAINT "fk_folder_closure_descendant" FOREIGN KEY ("id_descendant") REFERENCES folder ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE folder_closure CASCADE`);
        await queryRunner.query(`DROP TABLE folder CASCADE`);
    }
}
