import {AbstractCommand, ApplicationCommandOptionType} from '@usecase/commands/AbstractCommand';

class PingCommand extends AbstractCommand {
    public Command = {
        name: `ping`,
        description: `ping pong`,
        type: ApplicationCommandOptionType.STRING,
    };
}

export const ping = new PingCommand();
