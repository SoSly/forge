import {Config} from 'convict';
import {ConnectionOptions, createConnection, Connection} from 'typeorm';
import Path from 'path';

// Models
import {Document,DocumentContent} from '@domain/Document';
import {Folder} from '@domain/Folder';
import {User,UserSettings} from '@domain/User';

export default class DatabaseService {
    private config: ConnectionOptions
    private connection: Connection

    constructor(config: Config<any>) {
        this.config = this.getConnectionConfig(config);
    }

    private getConnectionConfig(config: Config<any>): ConnectionOptions {
        const connectionConfig: ConnectionOptions = {
            entities: [Document,DocumentContent,Folder,User,UserSettings],
            synchronize: true,
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
