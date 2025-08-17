import {MigrationInterface, QueryRunner} from "typeorm";

export class fixSelfReferencingFolders1755421808036 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log('Starting migration to fix self-referencing folders...');
        
        // Find all folders that are self-referencing (id_parent = id)
        const selfReferencingFolders = await queryRunner.query(`
            SELECT id, name FROM folder WHERE id = id_parent
        `);
        
        if (selfReferencingFolders.length > 0) {
            console.log(`Found ${selfReferencingFolders.length} self-referencing folders:`);
            selfReferencingFolders.forEach(folder => {
                console.log(`  - Folder "${folder.name}" (ID: ${folder.id})`);
            });
            
            // Move self-referencing folders to root level (id_parent = NULL)
            await queryRunner.query(`
                UPDATE folder 
                SET id_parent = NULL 
                WHERE id = id_parent
            `);
            
            // Clean up closure table entries for these folders
            await queryRunner.query(`
                DELETE FROM folder_closure 
                WHERE id_ancestor = id_descendant 
                AND id_ancestor IN (
                    SELECT UNNEST($1::bigint[])
                )
            `, [selfReferencingFolders.map(f => f.id)]);
            
            console.log(`Fixed ${selfReferencingFolders.length} self-referencing folders by moving them to root level.`);
        } else {
            console.log('No self-referencing folders found.');
        }
        
        // Find potential circular references in closure table
        const circularReferences = await queryRunner.query(`
            WITH RECURSIVE folder_paths AS (
                SELECT 
                    f.id,
                    f.name,
                    f.id_parent,
                    ARRAY[f.id] as path,
                    0 as depth
                FROM folder f
                WHERE f.id_parent IS NULL
                
                UNION ALL
                
                SELECT 
                    f.id,
                    f.name,
                    f.id_parent,
                    fp.path || f.id,
                    fp.depth + 1
                FROM folder f
                INNER JOIN folder_paths fp ON f.id_parent = fp.id
                WHERE f.id != ALL(fp.path) AND fp.depth < 100
            )
            SELECT id, name, path
            FROM folder_paths
            WHERE id = ANY(path[1:array_length(path,1)-1])
        `);
        
        if (circularReferences.length > 0) {
            console.log(`Found ${circularReferences.length} folders in circular reference chains:`);
            circularReferences.forEach(folder => {
                console.log(`  - Folder "${folder.name}" (ID: ${folder.id}) - Path: ${folder.path.join(' -> ')}`);
            });
            
            // Move folders with circular references to root level
            await queryRunner.query(`
                UPDATE folder 
                SET id_parent = NULL 
                WHERE id IN (
                    SELECT UNNEST($1::bigint[])
                )
            `, [circularReferences.map(f => f.id)]);
            
            // Clean up closure table entries for circular references
            for (const folder of circularReferences) {
                await queryRunner.query(`
                    DELETE FROM folder_closure 
                    WHERE id_descendant = $1
                `, [folder.id]);
                
                // Re-add self-reference in closure table
                await queryRunner.query(`
                    INSERT INTO folder_closure (id_ancestor, id_descendant) 
                    VALUES ($1, $1)
                `, [folder.id]);
            }
            
            console.log(`Fixed ${circularReferences.length} folders with circular references by moving them to root level.`);
        } else {
            console.log('No circular reference chains found.');
        }
        
        console.log('Migration completed successfully.');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log('Warning: This migration cannot be automatically reverted.');
        console.log('The original parent-child relationships of self-referencing and circular folders have been lost.');
        console.log('Manual intervention would be required to restore the previous (invalid) state.');
    }

}