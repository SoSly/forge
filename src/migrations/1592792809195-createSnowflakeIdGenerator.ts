import {MigrationInterface, QueryRunner} from "typeorm";

export class createSnowflakeIdGenerator1592792809195 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE seq_snowflake;`);
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION id_generator()
                returns bigint
                language 'plpgsql'
            AS $BODY$
            DECLARE
                our_epoch bigint := 1314220021721;
                seq_id bigint;
                now_millis bigint;
                -- the id of this DB shard, must be set for each
                -- schema shard you have - you could pass this as a parameter too
                shard_id int := 1;
                result bigint := 0;
            BEGIN
                SELECT nextval('seq_snowflake') % 1024 INTO seq_id;
                SELECT FLOOR(EXTRACT(EPOCH FROM clock_timestamp()) * 1000) INTO now_millis;
                result := (now_millis - our_epoch) << 23;
                result := result | (shard_id << 10);
                result := result | (seq_id);
                return result;
            END;
            $BODY$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP FUNCTION id_generator`);
        await queryRunner.query(`DROP SEQUENCE seq_snowflake`);
    }
}
