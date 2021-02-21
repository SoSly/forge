import {Config} from 'convict';
import {ConnectionOptions, createConnection, Connection} from 'typeorm';

// Entities
import {Auth} from '@domain/UserEntity';
import {UserSettings} from '@domain/UserSettingsEntity';
import {Folder} from '@domain/FolderEntity';
import {Document} from '@domain/DocumentEntity';
import {DocumentContent} from '@domain/DocumentContentEntity';

export default class DatabaseService {
    private config: ConnectionOptions
    private connection: Connection

    constructor(config: Config<any>) {
        this.config = this.getConnectionConfig(config);
    }

    private getConnectionConfig(config: Config<any>): ConnectionOptions {
        const connectionConfig: ConnectionOptions = {
            entities: [Auth,Document,DocumentContent,Folder,UserSettings],
            migrations: ['../migrations/{.ts,*.js}'],
            migrationsRun: true,
            synchronize: false,
            type: config.get('Database').driver,
            url: config.get('Database').connection,
            logger: "debug",
        };

        return connectionConfig;
    }

    public async start(): Promise<void> {
        try {
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
