import {Entity, Column, BaseEntity, DeepPartial, OneToMany, OneToOne, PrimaryColumn, JoinColumn, getConnection} from 'typeorm';
import { forge } from '../types';

// Models
import {Folder} from "./FolderEntities";

export class ProfileResponse {
    public id: string;
    public username: string;
    public provider: string;
    public providerId: string;
    public type: 'free' | 'unlimited';
    public avatar: string;
    public locale: string;
    public settings: {
        darkmode: boolean
    };
    public usage: {
        current: number,
        max: number
    };
    public csrfToken?: string;
}

@Entity({name: 'auth'})
export class Auth extends BaseEntity implements forge.User {
    @PrimaryColumn({type: 'bigint'})
    public id: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    public username: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    public provider: string;

    @Column({name: 'id_provider', type: 'varchar', length: 255, nullable: false})
    public providerId: string;

    @Column({type: 'enum', enum: ['free', 'unlimited'], default: 'free'})
    public type: 'free' | 'unlimited';

    @Column({type: 'varchar', length: 255, nullable: true})
    public avatar: string | null;
    
    @Column({type: 'varchar', length: 255, nullable: false})
    public locale: string;

    @OneToMany(type => Folder, folder => folder.user)
    public folders: Folder[];

    @OneToOne(type => UserSettings, settings => settings.user, {cascade: true})
    public settings: forge.UserSettings;

    public static async findOneOrCreate(params: DeepPartial<Auth>): Promise<Auth|void> {
        const {provider, providerId} = params;        
        let user: Auth|undefined = await Auth.findOne({provider, providerId}, {relations: ['settings']});
        if (user === undefined) {
            const results = await getConnection().createQueryBuilder()
                .insert().into(Auth).values(params).returning("*")
                .execute();
            user = Auth.create(results.generatedMaps[0] as DeepPartial<Auth>);

            const settings = UserSettings.create();
            settings.user = user;
            await settings.save();

            const rootFolder = Folder.create({name: `Your Workbench`});
            rootFolder.user = user;
            await rootFolder.save();
        }
        return user;
    }
}

@Entity({name: 'user_settings'})
export class UserSettings extends BaseEntity implements forge.UserSettings {
    @PrimaryColumn({type: 'bigint'})
    public id: string;

    @OneToOne(type => Auth, user => user.settings)
    @JoinColumn({name: 'id_auth'})
    public user: Auth;

    @Column({default: false})
    public darkmode: boolean;
}
