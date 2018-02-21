const Koa = require('koa');
const websockify = require('koa-websocket');
const messageHandler = require('./message-handler');
const session = require('./session');

// App
const app = websockify(new Koa());



// CORS
const cors = require('koa-cors');

app.use(cors({
    origin: true, // should be a function that matches origin with allowed list
    methods: ['GET', 'POST'],
    expose: ['x-auth-token']
}));




const authRouter = require('./routers/auth');
app.use(authRouter.routes());


// WebSockets

app.ws.use(function (ctx, next) {
    session.add(ctx);

    ctx.websocket.on('close', () => {
        session.remove(ctx);
    });

    ctx.websocket.on('message', (action) => {
        messageHandler(action, ctx);
    });
});

app.listen(process.env.PORT || 3001);
