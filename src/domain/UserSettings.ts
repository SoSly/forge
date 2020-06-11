import {BaseEntity, Entity, OneToOne, Column, JoinColumn, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

// Models
import {User} from "./User";

@Entity({name: 'user_settings'})
export class UserSettings extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: string;

    @OneToOne(type => User, user => user.settings)
    @JoinColumn()
    public user: User;

    @Column({default: false})
    public darkmode: boolean;
}
