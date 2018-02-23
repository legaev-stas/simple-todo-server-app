const Router = require('koa-router');
const passport = require('koa-passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const db = require('../db/models');
const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt');

const router = new Router({
    prefix: '/auth'
});

passport.use(new FacebookTokenStrategy({
        clientID: '254681075070412', // should be taken from Env Variables
        clientSecret: 'b029c2117c101542f41df7428baee438' // should be taken from Env Variables
    }, (accessToken, refreshToken, profile, done) => {
        return db.user.findOrCreate({
            where: {id: profile.id},
            defaults: {
                id: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                token: accessToken
            }
        }).spread(user => {
                done(null, user.get({plain: true}));
            }
        )
    }
));


const generateToken = (ctx, next) => {
    ctx.req.token = jwt.sign({
            id: ctx.state.user.id
        }, 'my-secret', // TODO: secret should be passed through Env variables
        {
            expiresIn: 60 * 120
        });
    next();
};

const sendToken = ctx => {
    ctx.status = 200;
    ctx.set('x-auth-token', ctx.req.token);
    ctx.body = JSON.stringify({id: ctx.state.user.id});
};

router.post('/facebook', passport.authenticate('facebook-token', {session: false}), (ctx, next) => {
    if (!ctx.state.user) {
        return ctx.status = 401;
    }

    next();
}, generateToken, sendToken);


//token handling middleware
const authenticate = koaJwt({
    secret: 'my-secret',
    passthrough: true,
    getToken: function (req) {
        if (req.headers['x-auth-token']) {
            return req.headers['x-auth-token'];
        }
        return null;
    }
});

const getCurrentUser = async (ctx) => {
    await db.user.findById(ctx.state.user.id).then(user => {
        if (!user) {
            ctx.status = 401;
        } else{
            ctx.status = 200;
            ctx.body = JSON.stringify(user.get({plain: true}));
        }
    });
};

router.get('/me', authenticate, getCurrentUser);


module.exports = router;