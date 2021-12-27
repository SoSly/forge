import { forge } from "../types";
import {ConnectionOptions, createConnection, Connection} from 'typeorm';

// Entities
import {Auth,UserSettings} from '@domain/UserEntities';
import {Folder} from '@domain/FolderEntities';
import {Document,DocumentContent} from '@domain/DocumentEntities';

export default class DatabaseService {
    private config: ConnectionOptions | undefined
    private connection: Connection

    constructor(config: forge.Config) {
        this.config = this.getConnectionConfig(config);
    }

    private getConnectionConfig(config: forge.Config): ConnectionOptions | undefined {
        switch (config.Database.driver) {
            case 'postgres':
                const conn: ConnectionOptions = {
                    entities: [Auth,Document,DocumentContent,Folder,UserSettings],
                    type: config.Database.driver,
                    url: config.Database.connection,
                    ssl: config.Database.ssl === false ? false : undefined,
                    logger: config.Database.logger,
                }
                return conn;
        }
    }

    public async start(): Promise<void> {
        try {
            if (!this.config) {
                console.error('invalid database configuration');
                process.exit(1);
            }
            this.connection = await createConnection(this.config);
        }
        catch (err) {
            throw err;
        }
    }

    public async stop(): Promise<void> {
        await this.connection.close();
    }
}
