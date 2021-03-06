const Koa = require('koa');
const websockify = require('koa-websocket');
const messageHandler = require('./message-handler');
const session = require('./session');

const app = websockify(new Koa());

app.ws.use(function(ctx, next) {
    session.add(ctx);

    ctx.websocket.on('close', () => {
        session.remove(ctx);
    });

    ctx.websocket.on('message', (action) => {
        messageHandler(action, ctx);
    });
});

app.listen(process.env.PORT || 3001);
