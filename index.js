const Koa = require('koa');
const WebSocket = require('ws');
const http = require('http');
const messageHandler = require('./message-handler');
const session = require('./session');

const app = new Koa();

// app.on('error', err => {
//     console.error('server error', err)
// });

// CORS
const cors = require('koa-cors');

app.use(cors({
    origin: true, // should be a function that matches origin with allowed list
    methods: ['GET', 'POST'],
    expose: ['x-auth-token']
}));


// routers
const authRouter = require('./routers/auth');
app.use(authRouter.routes());


const server = http.createServer(app.callback());
const wss = new WebSocket.Server({server});

wss.on('connection', function connection(ws, req) {
  session.add(ws);

  ws.on('close', () => {
    session.remove(ws);
  });

  ws.on('message', (action) => {
    messageHandler(action, ws);
  });
});

server.listen(process.env.PORT || 3001, () => console.log(`Listening on ${server.address().port}`));
