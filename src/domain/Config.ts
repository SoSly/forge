import { forge } from "../types";
import { DatabaseType } from 'typeorm';
import { Property, Config, TSConvict } from 'ts-convict';

class DatabaseConfig implements forge.DatabaseConfig {
    @Property({
        doc: 'The filename or URL to connect to the database',
        format: String,
        default: null,
        env: 'DATABASE_URL',
        sensitive: true
    })
    public connection: string;

    @Property({
        doc: 'The Database type to instantiate',
        format: String,
        default: 'sqljs',
        env: 'DATABASE_DRIVER'
    })
    public driver: DatabaseType;

    @Property({
        doc: 'The logger or log-levels to be used for Database connections',
        format: String,
        default: 'simple-console',
        env: 'DATABASE_LOGGER'
    })
    public logger: forge.Logger;

    @Property({
        doc: 'The SSL configuration for the database',
        format: Boolean,
        default: true,
        env: 'DATABASE_SSL',
    })
    public ssl: boolean;
}

class DiscordConfig implements forge.DiscordConfig {
    @Property({
        doc: 'The client ID for discord OAUTH',
        format: String,
        default: null,
        env: 'DISCORD_CLIENT_ID'
    })
    public client: string;

    @Property({
        doc: 'The secret key for discord OAUTH',
        format: String,
        default: null,
        env: 'DISCORD_SECRET_KEY',
        sensitive: true
    })
    public secret: string;
}

class EnvironmentConfig implements forge.EnvironmentConfig {
    @Property({
        doc: 'Environment',
        format: ['development', 'production', 'test'],
        default: 'development',
        env: 'NODE_ENV'
    })
    public name: forge.EnvironmentType;
}

class HTTPConfig implements forge.HTTPConfig {
    @Property({
        doc: 'The host name that the service will running on',
        format: String,
        default: 'localhost',
        env: 'HOST'
    })
    public host: string

    @Property({
        doc: 'The port that the API will run on',
        format: 'port',
        default: 7400,
        env: 'PORT'
    })
    public port: number

    @Property({
        doc: 'The protocol that the API will run on',
        format: String,
        default: 'http',
        env: 'PROTOCOL'
    })
    public protocol: string
}

class SessionConfig implements forge.SessionConfig {
    @Property({
        doc: 'The session key used for cookie steorage',
        format: String,
        default: null,
        env: 'SESSION_KEY'
    })
    public key: string;

    @Property({
        doc: 'The maximum age of your session',
        format: Number,
        default: 86400000,
        env: 'SESSION_AGE'
    })
    public maxAge: number
}

@Config({validationMethod: 'strict'})
export default class ForgeConfig implements forge.Config {
    @Property(DatabaseConfig)
    public Database: forge.DatabaseConfig;

    @Property(DiscordConfig)
    public Discord: forge.DiscordConfig;

    @Property(EnvironmentConfig)
    public Environment: forge.EnvironmentConfig;

    @Property(HTTPConfig)
    public HTTP: forge.HTTPConfig;

    @Property(SessionConfig)
    public Session: forge.SessionConfig;
}