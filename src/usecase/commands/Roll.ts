import {ApplicationCommandOption} from 'discord-slash-commands-client';
import {AbstractCommand, ApplicationCommandOptionType} from '@usecase/commands/AbstractCommand';
import {Interaction, Message, MessageEmbed} from 'discord.js';

import {Interpreter} from '../parser/Interpreter';
import {Parser} from '../parser/Parser';

class RollCommand extends AbstractCommand {
    public Command: ApplicationCommandOption = {
        name: `roll`,
        description: `rolls dice to the current channel`,
        type: ApplicationCommandOptionType.STRING,
        options: [
            {
                name: `formula`,
                description: `See the forge dice reference for details.`,
                type: ApplicationCommandOptionType.STRING,
                required: true
            }
        ]
    };

    async do(command: Interaction): Promise<number> {
        if (!command.options) {
            return 0
        }

        let formula = '';
        for (let option of command.options) {
            switch (option.name) {
                case 'formula': formula = option.value; break;
            }
        }

        try {
            const parser = new Parser(formula);
            const parsed = parser.parse();
            if (parsed.errs.length > 0) {
                return Promise.reject(parsed.errs);
            }
            const int = new Interpreter;
            if (!parsed.ast) {
                return Promise.reject(null);
            }

            const result = (await int.interpret(parsed.ast!)).toString();

            const output = new MessageEmbed;
            output.setColor('#0080C0');
            output.addField('User', this.mention(command.author));
            output.addField('Formula', formula);
            output.addField('Results', result);

            await command.channel.send(output);
            return output.length;
        } catch(err) {
            return Promise.reject(err);
        }
    }
}

export const roll = new RollCommand();
