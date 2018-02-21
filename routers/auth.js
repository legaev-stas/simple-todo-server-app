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
    ctx.res.writeHead(200, {
        'x-auth-token': ctx.req.token
    });
    ctx.res.end(JSON.stringify({id: ctx.state.user.id}));
};

router.post('/facebook', passport.authenticate('facebook-token', {session: false}), (ctx, next) => {
    if (!ctx.state.user) {
        return ctx.res.send(401, 'User Not Authenticated');
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

const getCurrentUser = (ctx, next) => {
    db.user.findById(ctx.state.user.id).then(user => {
        if (!user) {
            ctx.res.statusCode = 401;
            ctx.res.statusMessage = 'User Not Authenticated';
            ctx.res.end();
            return;
        }

        ctx.req.user = user.get({plain: true});
        next();
    });
};

const getOne = (ctx) => {
    ctx.res.status = 200;
    ctx.res.end(JSON.stringify(ctx.req.user));
};

router.get('/me', (ctx, next)=>{
    ctx.respons.end()
}, authenticate, getCurrentUser, getOne);


module.exports = router;