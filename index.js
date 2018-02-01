const Koa = require('koa');
const websockify = require('koa-websocket');

const { Client } = require('pg');
const client = new Client();

client.connect();

const app = websockify(new Koa());

const CATEGORY_CREATE = 'CATEGORY_CREATE';
const CATEGORY_UPDATE = 'CATEGORY_UPDATE';
const CATEGORY_DELETE = 'CATEGORY_DELETE';
const CATEGORY_SYNC = 'CATEGORY_SYNC';

const TASK_DELETE = 'TASK_DELETE';
const TASK_CREATE = 'TASK_CREATE';
const TASK_UPDATE = 'TASK_UPDATE';
const TASK_SYNC = 'TASK_SYNC';

const SYNC_CLIENT = 'SYNC_CLIENT';


app.ws.use(function(ctx, next) {
    ctx.websocket.on('message', function(message) {
        const {type, payload = {}} = JSON.parse(message);
        console.log(type, payload)
        switch(type){
            case SYNC_CLIENT:
                client.query('SELECT * FROM category', (err, res) => {
                    if(err){
                        console.log(err.stack)
                    }

                    ctx.websocket.send(JSON.stringify({
                        type: CATEGORY_SYNC,
                        payload: res.rows
                    }));
                });

                client.query('SELECT * FROM task', (err, res) => {
                    if(err){
                        console.log(err.stack)
                    }

                    ctx.websocket.send(JSON.stringify({
                        type: TASK_SYNC,
                        payload: res.rows
                    }));
                });
                break;


            case CATEGORY_CREATE:
                client.query(`INSERT INTO category(id, title) VALUES('${payload.id}', '${payload.title}')`);
                break;


            case CATEGORY_UPDATE:
                client.query(`UPDATE category SET title='${payload.title}' WHERE id='${payload.id}'`);
                break;


            case CATEGORY_DELETE:
                client.query(`DELETE FROM category WHERE id='${payload.id}'`);
                break;


            case TASK_CREATE:
                client.query(`INSERT INTO task(id, category, title, description, completed) VALUES('${payload.id}', '${payload.category}', '${payload.title}', '${payload.description}', ${payload.completed})`);
                break;


            case TASK_UPDATE:
                client.query(`UPDATE task SET category='${payload.category}', title='${payload.title}', description='${payload.description}', completed=${payload.completed}  WHERE id='${payload.id}'`);
                break;


            case TASK_DELETE:
                client.query(`DELETE FROM task WHERE id='${payload.id}'`);
                break;
        }
        // ctx.websocket.send(JSON.stringify({
        //     type: 'CATEGORY_SYNC',
        //     payload: [{id: '123', title: 'New category'}, {id: 'zxc', title: 'Second cate'}]
        // }));

    });
});

app.listen(3001);