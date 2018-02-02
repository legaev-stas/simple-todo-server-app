const Koa = require('koa');
const websockify = require('koa-websocket');
const messageHandler = require('./message-handler');
const session = require('./session');
const client = require('./db');


const app = websockify(new Koa());
app.context.db = client;

app.ws.use(function(ctx, next) {
    session.add(ctx);

    ctx.websocket.on('close', () => {
        session.remove(ctx);
    });


    ctx.websocket.on('message', (action) => {
        messageHandler(action, ctx);
    });
});

app.listen(3001);
