import {Config} from 'convict';
import {ConnectionOptions, createConnection, Connection} from 'typeorm';
import {User} from '@domain/User'


export default class DatabaseService {
    private config: ConnectionOptions
    private connection: Connection

    constructor(config: Config<any>) {
        this.config = this.getConnectionConfig(config);
    }

    private getConnectionConfig(config: Config<any>): ConnectionOptions {
        const baseConfig = {
            entities: [User]
        };

        let connectionConfig: ConnectionOptions;
        switch (config.get('Database').driver) {
            case 'sqlite':
                connectionConfig = {
                    ...baseConfig,
                    database: config.get('Database').connection,
                    type: 'sqlite'
                };
                break;
            default:
                connectionConfig = {
                    ...baseConfig,
                    type: config.get('Database').driver,
                    url: config.get('Database').connection,
                    migrations: ['../usecase/migrations/*.ts']
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
