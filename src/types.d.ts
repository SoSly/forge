import { DatabaseType, Logger } from "typeorm";

declare namespace forge {
    export type AUDIT_ACTION = 'set_user_type' | 'ban_user' | 'delete_user_content';
    export type Logger = "advanced-console" | "simple-console" | "file" | "debug";
    export type EnvironmentType = 'development' | 'production' | 'test';

    export interface AuditLog {
        id: string
        user: User
        action: AUDIT_ACTION
        createdAt: Date
        affected_user: User
        detail: string
        note: string
    }

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

    export interface Document {
        id: string
        name: string
        type: 'markdown' | 'stylesheet'
        size: number
        createdAt: Date
        updatedAt: Date
        current: DocumentContent
    }

    export interface DocumentContent {
        id: string
        document: Document
        contents: string
        remove(): Promise<this>
        save(): Promise<this>
    }

    export interface User {
        id: string
        username: string
        provider: string
        providerId: string
        type: 'free' | 'unlimited'
        avatar: string | null
        locale: string
    }

    export interface UserSettings {
        id: string
        user: User
        darkmode: boolean
        save(): Promise<this>
    }

    export interface UserRights {
        user: User
        grant: boolean
        audit: boolean
        user_list: boolean
        document_list: boolean
        ban_user: boolean
        delete_content: boolean
        save(): Promise<this>
    }
}