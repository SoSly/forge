import {Client, ClientOptions} from 'discord.js';
import {Client as InteractionsClient} from 'discord-slash-commands-client'

export class DiscordClient extends Client {
    public interactions: InteractionsClient;
    
    constructor(options?: ClientOptions) {
        super(options);
    }
}
