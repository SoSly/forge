import {BaseEntity, Entity, OneToOne, Column, JoinColumn, PrimaryColumn} from "typeorm";

// Models
import {User} from "./User";

@Entity({name: 'user_settings'})
export class UserSettings extends BaseEntity {
    @PrimaryColumn({type: 'varchar', length: 16})
    public id: string

    @OneToOne(type => User, user => user.settings)
    @JoinColumn()
    public user: User

    @Column({default: false})
    public darkmode: boolean
}
