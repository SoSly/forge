import {Config} from 'convict';
import DiscordStrategy from 'passport-discord';
import Passport from 'koa-passport';
import Router from '@koa/router';
import {User, UserInterface} from '@domain/User';
import FlakeId from 'flake-idgen';
import Koa, {Context, Next, Middleware} from 'koa';

const ErrUserNotFound = new Error('User not found');
const RETURN_TO_COOKIE = 'forge.returnTo';

class Auth {
    config: Config<any>;
    router: Router;

    constructor(config: Config<any>) {
        this.config = config;
        
        // configure Discord oauth
        const strategy = new DiscordStrategy({
            callbackURL: this.getCallbackURL(),
            clientID: config.get('Discord').client,
            clientSecret: config.get('Discord').secret,
            scope: ['identify'],
        }, this.verifyStrategy);

        // configure Passport
        Passport.serializeUser(this.serializeUser);
        Passport.deserializeUser(this.deserializeUser);
        Passport.use(strategy);
        
        // configure routes
        this.router = new Router();
        this.router.get('/auth/discord', this.handleAuth);
        this.router.get('/auth/discord/callback', this.handleAuth, this.handleAuthCallback);
    }

    async deserializeUser(obj: string, done:  (err: any, user?: User) => void): Promise<any> {
        try {
            const profile: UserInterface = JSON.parse(obj);
            const user = await User.findOneOrCreate(profile);
            if (user) done(null, user);
            done(ErrUserNotFound);
        }
        catch (err) {
            done(err);
        }
    }

    ensureAuth(ctx: Context, next: Next): void {
        if (!ctx.isAuthenticated()) {
            const returnTo = ctx.cookies.get(RETURN_TO_COOKIE);
            if (returnTo === undefined) ctx.cookies.set(RETURN_TO_COOKIE, ctx.path);    
            return ctx.redirect('/auth/discord');
        }
        next();
    }

    getCallbackURL(): string {
        const http = this.config.get('HTTP');
        switch(this.config.get('Environment').name) {
            case 'development':
                return `${http.protocol}://${http.host}:${http.port}/auth/discord/callback`;
            default:
                return `${http.protocol}://${http.host}/auth/discord/callback`;
        }
    }

    handleAuth(ctx: Context, next: Next): Middleware {
        return Passport.authenticate('discord')(ctx, next);
    }

    handleAuthCallback(ctx: Context, next: Next): void {
        const returnTo = ctx.cookies.get(RETURN_TO_COOKIE);
        ctx.cookies.set(RETURN_TO_COOKIE, '');
        ctx.redirect(returnTo || '');
    }

    serializeUser(user: User, done: (err: any, user: string) => void): void {
        done(null, JSON.stringify(user));
    }

    async verifyStrategy(accessToken: string, refreshToken: string, profile: DiscordStrategy.Profile, done: CallableFunction): Promise<void> {
        try {
            const lookup: UserInterface = {
                provider: profile.provider,
                provider_id: profile.id,
                username: profile.username,
                avatar: profile.avatar,
                locale: profile.locale
            }
            const user = await User.findOneOrCreate(lookup);
            done(null, user);
        }
        catch (err) {
            done(err);
        }
    }
}

export function setupAuthMiddleware(app: Koa, config: Config<any>): void {
    const auth = new Auth(config);
    app.use(Passport.initialize());
    app.use(Passport.session());
    app.use(auth.router.routes());
    app.use(auth.ensureAuth);
}
