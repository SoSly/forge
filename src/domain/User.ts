import FlakeId from "flake-idgen";
import {Entity, Column, PrimaryColumn, BaseEntity, DeepPartial, FindOneOptions} from 'typeorm';

@Entity({name: 'user'})
export class User extends BaseEntity {
    @PrimaryColumn()
    public id: string;

    @Column()
    public username: string;

    @Column()
    public provider: string;

    @Column()
    public provider_id: string;

    @Column()
    public avatar?: string;
    
    @Column()
    public locale: string;

    public static async findOneOrCreate(params: DeepPartial<User>): Promise<User|void> {
        const {provider, provider_id} = params;        
        let user: User|undefined = await this.findOne({provider, provider_id});
        if (user === undefined) {
            params.id = new FlakeId().next().toString('hex');
            user = this.create(params);
            await user.save();
        }
        return user;
    }
}
