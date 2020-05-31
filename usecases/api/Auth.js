import DiscordStrategy from 'passport-discord';
import Passport from 'koa-passport';
import Router from '@koa/router';
import User from '../../domain/User.js';

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
            callbackURL: `${http.protocol}://${http.host}:${http.port}/auth/discord/callback`,
            clientID: discord.client,
            clientSecret: discord.secret,
            failureRedirect: '/',
            scope: ['identify'],
            successRedirect: '/',
        }, this.verifyStrategy);
        Passport.use(strategy);

        // configure routes
        this.router = new Router();
        this.router.get('/auth/discord', Passport.authenticate('discord', {successReturnToOrRedirect: '/profile'}));
        this.router.get('/auth/discord/callback', Passport.authenticate('discord'));
    }

    ensureAuth(ctx, next) {
        console.log(ctx.isAuthenticated());
        if (!ctx.isAuthenticated()) {
            return ctx.redirect('/auth/discord');
        }
        return next();
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
