import {ApplicationCommandOption, Client} from 'discord-slash-commands-client';
import {Interaction, User} from 'discord.js';

export enum ApplicationCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
}

export class AbstractCommand {
    public Command: ApplicationCommandOption;

    start(client: Client): void {
        client.createCommand(this.Command).catch(this.err);
    }

    async do(command: Interaction): Promise<number> {
        await command.channel.send("pong");
        return 4;
    }

    async err (input: string): Promise<void> {
        console.error(input);
    }

    protected mention(author: User|null): string {
        if (!author) {
            return '';
        }

        return `<@${author.id}>`;
    }
}
