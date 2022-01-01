import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { forge } from "types";
import ForgeConfig from "./Config";
import { Auth } from "./UserEntities";

export class AdminLogResponse {
    id: string
    user: forge.User
    action: forge.AUDIT_ACTION
    createdAt: Date
    affected_user: forge.User
    detail: string
    note: string
}

@Entity({name: 'audit'})
export class AuditLog extends BaseEntity implements forge.AuditLog {
    @PrimaryColumn({type: 'bigint'})
    public id: string;

    @ManyToOne(type => Auth)
    @JoinColumn({name: 'id_auth'})
    public user: forge.User;

    @Column({type: 'enum', enum: ['set_user_type', 'ban_user', 'delete_user_content']})
    public action: forge.AUDIT_ACTION;

    @CreateDateColumn()
    public createdAt: Date;

    @ManyToOne(type => Auth)
    @JoinColumn({name: 'id_affected_user'})
    public affected_user: forge.User;

    @Column({type: 'char', length: 64})
    public detail: string;

    @Column({type: 'varchar', length: 255})
    public note: string;
}