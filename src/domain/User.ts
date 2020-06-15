import FlakeId from "flake-idgen";
import {Entity, Column, BaseEntity, DeepPartial, Index, OneToMany, OneToOne, PrimaryGeneratedColumn, JoinColumn} from 'typeorm';

// Models
import {Folder} from "./Folder";

@Entity({name: 'user'})
@Index(['provider', 'providerId'], {unique: true})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    public username: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    public provider: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    public providerId: string;

    @Column({type: 'varchar', length: 255, nullable: true})
    public avatar?: string;
    
    @Column({type: 'varchar', length: 255, nullable: false})
    public locale: string;

    @OneToMany(type => Folder, folder => folder.user)
    public folders: Folder[];

    @OneToOne(type => UserSettings, settings => settings.user, {cascade: true})
    public settings: UserSettings;

    public static async findOneOrCreate(params: DeepPartial<User>): Promise<User|void> {
        const {provider, providerId} = params;        
        let user: User|undefined = await User.findOne({provider, providerId}, {relations: ['settings']});
        if (user === undefined) {
            // const id = new FlakeId().next().toString('hex');
            user = User.create(params);
            user.settings = UserSettings.create();
            await user.save();
            
            const rootFolder = Folder.create({name: `Your Workbench`});
            rootFolder.user = user;
            await rootFolder.save();
        }
        return user;
    }
}

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
