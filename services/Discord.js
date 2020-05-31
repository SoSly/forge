import DiscordOauth2 from 'discord-oauth2';

export default class DiscordService {
    config;
    oauth;

    constructor(config) {
        this.config = config.get('Discord');
        this.oauth = new DiscordOauth2();

    }
}
