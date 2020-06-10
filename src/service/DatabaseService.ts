import {Config} from 'convict';
import {ConnectionOptions, createConnection, Connection} from 'typeorm';
import Path from 'path';

// Models
import {Document} from '@domain/Document';
import {Folder} from '@domain/Folder';
import {User} from '@domain/User';
import {UserSettings} from '@domain/UserSettings';

export default class DatabaseService {
    private config: ConnectionOptions
    private connection: Connection

    constructor(config: Config<any>) {
        this.config = this.getConnectionConfig(config);
    }

    private getConnectionConfig(config: Config<any>): ConnectionOptions {
        const baseConfig = {
            entities: [Document,Folder,User,UserSettings],
            synchronize: true,
            logger: "debug",
        };

        let connectionConfig: ConnectionOptions;
        switch (config.get('Database').driver) {
            case 'sqljs':
                connectionConfig = {
                    ...baseConfig,
                    autoSave: true,
                    location: Path.join(process.cwd(), config.get('Database').connection),
                    type: 'sqljs',
                };
                break;
            default:
                connectionConfig = {
                    ...baseConfig,
                    type: config.get('Database').driver,
                    url: config.get('Database').connection
                };
                break;
        }
        return connectionConfig;
    }

    public async start(): Promise<void> {
        this.connection = await createConnection(this.config);
    }

    public async stop(): Promise<void> {
        await this.connection.close();
    }
}
