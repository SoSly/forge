import DiscordStrategy from 'passport-discord';
import Passport from 'koa-passport';
import Router from '@koa/router';
import {Auth} from '@domain/UserEntities';
import Koa, {Context, Next, Middleware} from 'koa';
import {AbstractRouter} from './AbstractRouter';
import { forge } from 'types';

const ErrUserNotFound = new Error('User not found');

class AuthRouter extends AbstractRouter {
    private config: forge.Config;

    constructor(config: forge.Config) {
        super();

        this.config = config;
        
        // configure Discord oauth
        const strategy = new DiscordStrategy({
            callbackURL: this.getCallbackURL(),
            clientID: config.Discord.client,
            clientSecret: config.Discord.secret,
            scope: ['identify'],
        }, this.verifyDiscordStrategy);

        // configure Passport
        Passport.serializeUser(this.serializeUser);
        Passport.deserializeUser(this.deserializeUser);
        Passport.use(strategy);
        
        // configure routes
        this.router = new Router({prefix: '/auth'});
        this.router.get('/discord', this.handleDiscord);
        this.router.get('/discord/callback', this.handleDiscord, this.handleDiscordCallback);
        this.router.get('/login', this.handleDiscord);
        this.router.get('/logout', this.handleLogout);
    }

    private async deserializeUser(obj: string, done:  (err: any, user?: Auth) => void): Promise<any> {
        try {
            const profile: Object = JSON.parse(obj);
            const user = await Auth.findOneOrCreate(profile);
            if (user) done(null, user);
            done(ErrUserNotFound);
        }
        catch (err) {
            done(err);
        }
    }

    public async ensureAuth(ctx: Context, next: Next): Promise<void> {
        if (!ctx.isAuthenticated()) return ctx.throw(401, {data: {error: 'UNAUTHORIZED', message: 'Invalid token.'}});
        await next();
    }

    private getCallbackURL(): string {
        const http = this.config.HTTP;
        switch(this.config.Environment.name) {
            case 'development': return `${http.protocol}://${http.host}:${http.port}/auth/discord/callback`;
            default: return `${http.protocol}://${http.host}/auth/discord/callback`;
        }
    }

    private handleDiscord(ctx: Context, next: Next): Middleware {
        return Passport.authenticate('discord')(ctx, next);
    }

    private handleDiscordCallback(ctx: Context, next: Next): void {
        ctx.redirect('/');
    }

    private async handleLogout(ctx: Context, next: Next): Promise<void> {
        ctx.logout();
        ctx.redirect('/');
    }

    private serializeUser(user: Auth, done: (err: any, user: string) => void): void {
        done(null, JSON.stringify(user));
    }

    private async verifyDiscordStrategy(accessToken: string, refreshToken: string, profile: DiscordStrategy.Profile, done: CallableFunction): Promise<void> {
        try {
            const user = await Auth.findOneOrCreate({
                provider: profile.provider,
                providerId: profile.id,
                username: profile.username,
                avatar: profile.avatar,
                locale: profile.locale
            });
            done(null, user);
        }
        catch (err) {
            done(err);
        }
    }
}

export function setupAuthMiddleware(app: Koa, config: forge.Config): void {
    const auth = new AuthRouter(config);
    app.use(Passport.initialize());
    app.use(Passport.session());
    app.use(auth.routes());
    app.use(auth.allowedMethods());
    app.use(auth.ensureAuth);
}
