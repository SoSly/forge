import FlakeId from "flake-idgen";
import {Entity, Column, PrimaryColumn, BaseEntity} from 'typeorm';
import { Interface } from "readline";

export interface UserInterface {
    id?: string,
    username?: string,
    provider?: string,
    provider_id?: string,
    avatar?: string,
    locale?: string 
}

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    username: string;

    @Column()
    provider: string;

    @Column()
    provider_id: string;

    @Column()
    avatar?: string;
    
    @Column()
    locale: string;

    static async findOneOrCreate(params: UserInterface): Promise<User|void> {
        let user = await User.findOne(params);
        if (!user) {
            user = new User();
            user.id = new FlakeId().next().toString('base64');
            user.provider = 'discord';
            if (params.provider_id) user.provider_id = params.provider_id;
            if (params.locale) user.locale = params.locale;
            if (params.username) user.username = params.username;
            user.avatar = params.avatar;
            await user.save();
        }
        return user;
    }
}
