import { DatabaseType, Logger } from "typeorm";

declare namespace forge {
    export type Logger = "advanced-console" | "simple-console" | "file" | "debug";
    export type EnvironmentType = 'development' | 'production' | 'test';

    export interface Config {
        Database: DatabaseConfig,
        Discord: DiscordConfig,
        Environment: EnvironmentConfig,
        HTTP: HTTPConfig,
        Session: SessionConfig
    }

    export interface DatabaseConfig {
        connection: string,
        driver: DatabaseType,
        logger: Logger,
        ssl: boolean
    }

    export interface DiscordConfig {
        client: string,
        secret: string
    }

    export interface EnvironmentConfig {
        name: EnvironmentType
    }

    export interface HTTPConfig {
        host: string,
        port: number,
        protocol: string
    }

    export interface SessionConfig {
        key: string,
        maxAge: number,
    }
}