import chalk from 'chalk';
import humanize from 'humanize-number';
import {Config} from "convict";
import {DiscordClient} from '@domain/DiscordClient';
import {Interaction} from 'discord.js';
import {Client as InteractionsClient, ApplicationCommand} from 'discord-slash-commands-client';

import {ping} from '@usecase/commands/Ping';
import {roll} from '@usecase/commands/Roll';

export default class DiscordService {
    private client: DiscordClient;
    private config: Config<any>;
    private interactor: InteractionsClient;

    constructor(config: Config<any>) {
        this.config = config;
        const clientID = this.config.get('Discord').client;
        const secret = this.config.get('Discord').secret;
        this.interactor = new InteractionsClient(secret, clientID);
        this.client = new DiscordClient();
        this.client.interactions = this.interactor;
    }

    async onError(err: string): Promise<void> {
        console.error(err);
    }

    async onInteraction(interaction: Interaction): Promise<void> {
        const start = Date.now();
        console.log(`  ${chalk.gray('<--')} ${chalk.bold('INTERACTION')} ${chalk.gray('%s')}`, interaction.name);

        let upstream = chalk.gray('-->');
        let length = 0;
        try {
           switch (interaction.name) {
                case roll.Command.name: length = await roll.do(interaction); break;
            }
        } catch (error) {
            upstream = chalk.red('xxx');
        } finally {
            console.log(`  ${upstream} ${chalk.bold('INTERACTION')} ${chalk.gray('%s')} ${chalk.gray('%s')} ${chalk.gray('%s')}`, interaction.name, time(start), length);
        }
    }

    async start(): Promise<void> {
        this.client.on('interactionCreate', this.onInteraction);
        this.client.on('ready', async () => {
            await this.interactor.createCommand(roll.Command).catch(this.onError);
            await this.interactor.getCommands().then(console.log);
        })

        const secret = this.config.get('Discord').secret;
        this.client.login(secret);
    }

    async stop(): Promise<void> {
        return this.clearCommands()
            .then(this.client.destroy);
    }

    private async clearCommands(): Promise<void> {
        return this.interactor.getCommands()
            .then(async (commands: ApplicationCommand[]) => {
                for (let command of commands) {
                    await this.interactor.deleteCommand(command.id).catch(this.onError);
                }
                await this.interactor.getCommands().then(console.log);
            });
    }
}

/**
 * Show the response time in a human readable format.
 * In milliseconds if less than 10 seconds,
 * in seconds otherwise.
 */
function time(start: number): string {
    const delta = Date.now() - start;
    return humanize(
        delta < 10000 ? delta + 'ms' : Math.round(delta / 1000) + 's'
    );
}
