import {MigrationInterface, QueryRunner} from "typeorm";

export class sizes1593160758510 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE document
            ADD COLUMN "size" int NOT NULL DEFAULT 0;
        `);
        
        await queryRunner.query(`
            ALTER TABLE folder
            ADD COLUMN "size" int NOT NULL DEFAULT 0;
        `);


        // Update document size
        const documents = await queryRunner.query(`
            SELECT 
                "document"."id" AS "id", 
                "document"."name" AS "name", 
                "document_content"."contents" AS "contents"
            FROM "document" 
            JOIN "document_content" 
            ON document_content.id_document = document.id;
        `);

        for (const document of documents) {
            const size = document.contents.length + document.name.length;
            await queryRunner.query(`UPDATE "document" SET "size"=$1 WHERE "id"=$2;`, [size, document.id]);
        }

        // Update folder sizes
        const folders = await queryRunner.query(`SELECT "name", "id" FROM "folder" WHERE "id_parent" IS NULL`);
        for (const folder of folders) {
            await this.updateFolderSize(queryRunner, folder.name, folder.id);
        }
    }

    private async updateFolderSize(queryRunner: QueryRunner, name: string, id: string): Promise<number> {
        const folders = await queryRunner.query(`SELECT "name", "id" FROM "folder" WHERE "id_parent" = $1;`, [id]);
        let size = name.length;
        console.log('name=', name, 'size=', size);

        if (folders.length > 0) {
            for (const folder of folders) {
                size += await this.updateFolderSize(queryRunner, folder.name, folder.id);
            }
            console.log('name=', name, 'size=', size);
        }

        const documents = await queryRunner.query(`SELECT "id", "size" FROM "document" WHERE "id_folder" = $1;`, [id]);
        if (documents.length > 0) {
            for (const document of documents) {
                size += document.size;
                console.log('document=', document.id, 'size=', document.size);
            }
        }

        console.log('name=', name, 'size=', size);
        await queryRunner.query(`UPDATE "folder" SET "size"=$1 WHERE "id"=$2;`, [size, id])
        return size;
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE document
            DROP COLUMN "size";
        `);

        await queryRunner.query(`
            ALTER TABLE folder
            DROP COLUMN "size";
        `);
    }
}
