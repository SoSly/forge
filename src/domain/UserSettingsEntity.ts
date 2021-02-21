import {Entity, BaseEntity, PrimaryColumn, OneToOne, JoinColumn, Column} from "typeorm";
import {Auth} from '@domain/UserEntity';

@Entity({name: 'user_settings'})
export class UserSettings extends BaseEntity {
    @PrimaryColumn({type: 'bigint'})
    public id: string;

    @OneToOne(type => Auth, user => user.settings)
    @JoinColumn({name: 'id_auth'})
    public user: Auth;

    @Column({default: false})
    public darkmode: boolean;
}
