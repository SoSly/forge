const users = {}

const ErrorMissingDiscordID = Error("No Discord ID was provided.");

export default class User {
    constructor(profile) {
        this.id = profile.id;
        this.username = profile.username;
        this.avatar = profile.avatar;
        this.locale = profile.locale;
    }

    static async findOrCreate(profile) {
        if (!profile.id) {
            throw ErrorMissingDiscordID;
        }

        if (users[profile.id]) return users[profile.id];
        const user = new User(profile);
        users[profile.id] = user;
        return user;
    }
}
