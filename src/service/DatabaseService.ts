import {Config} from 'convict';
import {ConnectionOptions, createConnection, Connection} from 'typeorm';
import {User} from '@domain/User'


export default class DatabaseService {
    config: ConnectionOptions
    connection: Connection

    constructor(config: Config<any>) {
        switch (config.get('Database').driver) {
            case 'sqlite':
                this.config = {
                    database: config.get('Database').connection,
                    entities: [User],
                    type: 'sqlite',
                };
                break;
            default:
                this.config = {
                    entities: [User],
                    synchronize: true,
                    type: config.get('Database').driver,
                    url: config.get('Database').connection,
                };
                break;
        }
    }
    
    async start(): Promise<void> {
        this.connection = await createConnection(this.config);
    }

    async stop(): Promise<void> {
        await this.connection.close();
    }
}
