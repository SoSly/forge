import DiscordStrategy from 'passport-discord';
import Passport from 'koa-passport';
import Router from '@koa/router';
import User from '../../domain/User.js';

const RETURN_TO_COOKIE = 'forge.returnTo';

class Auth {
    constructor(config) {
        // configure passport user serialization
        Passport.serializeUser((user, done) => {
            done(null, JSON.stringify(user));
        })

        Passport.deserializeUser(async (obj, done) => {
            try {
                const profile = JSON.parse(obj);
                const user = await User.findOrCreate(profile);
                done(null, user);
            }
            catch (err) {
                done(err);
            }
        });

        // configure passport for discord oauth
        const http = config.get('HTTP');
        const discord = config.get('Discord');
        const strategy = new DiscordStrategy({
            callbackURL: `${http.protocol}://${http.host}/auth/discord/callback`,
            clientID: discord.client,
            clientSecret: discord.secret,
            failureRedirect: '/',
            scope: ['identify'],
        }, this.verifyStrategy);
        Passport.use(strategy);

        // configure routes
        this.router = new Router();
        this.router.get('/auth/discord', this.handleAuth);
        this.router.get('/auth/discord/callback', this.handleAuth, this.handleAuthCallback);
    }

    ensureAuth(ctx, next) {
        if (!ctx.isAuthenticated()) {
            const returnTo = ctx.cookies.get(RETURN_TO_COOKIE);
            if (returnTo === undefined) ctx.cookies.set(RETURN_TO_COOKIE, ctx.path);    
            return ctx.redirect('/auth/discord');
        }
        return next();
    }

    handleAuth(ctx, next) {
        return Passport.authenticate('discord')(ctx, next);
    }

    handleAuthCallback(ctx, next) {
        const returnTo = ctx.cookies.get(RETURN_TO_COOKIE);
        ctx.cookies.set(RETURN_TO_COOKIE, '');
        ctx.redirect(returnTo);
    }

    async verifyStrategy(accessToken, refreshToken, profile, done) {
        const user = await User.findOrCreate(profile);
        done(null, user);
    }
}

export default function getAuthMiddleware(app, config) {
    const auth = new Auth(config);
    app.use(Passport.initialize());
    app.use(Passport.session());
    app.use(auth.router.routes());
    app.use(auth.ensureAuth);
}
