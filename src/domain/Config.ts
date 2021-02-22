import dotenv from 'dotenv';
import {Config} from 'convict';
import convict from 'convict';
import { existsSync } from 'fs';

dotenv.config();

const ForgeConfig: Config<any> = convict({
    Database: {
        driver: {
            doc: 'The Database type to instantiate',
            format: String,
            default: 'sqljs',
            env: 'DATABASE_DRIVER'
        },
        connection: {
            doc: 'The filename or URL to connect to the database',
            format: String,
            default: null,
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
        token: {
            doc: 'The client token for the discord server',
            format: String,
            default: null,
            env: 'DISCORD_CLIENT_TOKEN',
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

ForgeConfig.validate();

export default ForgeConfig;
