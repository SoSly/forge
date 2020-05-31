import {Config} from 'convict';
import convict from 'convict';
import { existsSync } from 'fs';

const ForgeConfig: Config<any> = convict({
    Database: {
        driver: {
            doc: 'The Database type to instantiate',
            format: String,
            default: 'sqlite',
            env: 'DATABASE_DRIVER'
        },
        logging: {
            doc: 'Whether to enable database logging',
            format: Boolean,
            default: false,
            env: 'DATABASE_LOGGING'
        },
        connection: {
            doc: 'The filename or URL to connect to the database',
            format: String,
            default: '',
            env: 'DATABASE_URL',
            sensitive: true
        }
    },
    Discord: {
        client: {
            doc: 'The client ID for discord OAUTH',
            format: String,
            default: null,
            env: 'DISCORD_CLIENT_ID'
        },
        secret: {
            doc: 'The secret key for discord OAUTH',
            format: String,
            default: null,
            env: 'DISCORD_SECRET_KEY',
            sensitive: true
        }
    },
    Environment: {
        name: {
            doc: 'Environment',
            format: ['development', 'production', 'test'],
            default: 'development',
            env: 'NODE_ENV'
        },
        filePath: {
            doc: 'ThePath to .env file',
            format: String,
            default: '.env.json',
        }
    },
    HTTP: {
        host: {
            doc: 'The host name that the service will running on',
            format: String,
            default: 'localhost',
            env: 'HOST'
        },
        port: {
            doc: 'The port that the API will run on',
            format: 'port',
            default: 7400,
            env: 'PORT'
        },
        protocol: {
            doc: 'The protocol that the API will run on',
            format: String,
            default: 'http',
            env: 'PROTOCOL'
        }
    },
});

const environment = ForgeConfig.get('Environment');
if (environment.name === 'development' && existsSync(environment.filePath)) {
    ForgeConfig.loadFile(environment.filePath);
}

ForgeConfig.validate();

export default ForgeConfig;
