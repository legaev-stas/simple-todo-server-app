const client = require('./db');
const session = require('./session');

const CATEGORY_CREATE = 'CATEGORY_CREATE';
const CATEGORY_UPDATE = 'CATEGORY_UPDATE';
const CATEGORY_DELETE = 'CATEGORY_DELETE';
const CATEGORY_SYNC = 'CATEGORY_SYNC';

const TASK_DELETE = 'TASK_DELETE';
const TASK_CREATE = 'TASK_CREATE';
const TASK_UPDATE = 'TASK_UPDATE';
const TASK_SYNC = 'TASK_SYNC';

const SYNC_CLIENT = 'SYNC_CLIENT';

const sendToOtherSessions = (action, currentWs) => {
    console.log( session.getList().length)
    session.getList().forEach(ws => {
        if(currentWs !== ws){
            ws.send(action);
        }
    });
};

module.exports = (action, ws) => {
    const {type, payload = {}} = JSON.parse(action);
    console.log(type, payload);
    switch (type) {
        case SYNC_CLIENT:
            client.query('SELECT * FROM category', (err, res) => {
                if (err) {
                    console.log(err.stack)
                }

                ws.send(JSON.stringify({
                    type: CATEGORY_SYNC,
                    payload: res.rows
                }));
            });

            client.query('SELECT * FROM task', (err, res) => {
                if (err) {
                    console.log(err.stack)
                }

                ws.send(JSON.stringify({
                    type: TASK_SYNC,
                    payload: res.rows
                }));
            });
            break;


        case CATEGORY_CREATE:
            client.query(`INSERT INTO category(id, title) VALUES('${payload.id}', '${payload.title}')`);
            sendToOtherSessions(action, ws);
            break;


        case CATEGORY_UPDATE:
            client.query(`UPDATE category SET title='${payload.title}' WHERE id='${payload.id}'`);
            sendToOtherSessions(action, ws);
            break;


        case CATEGORY_DELETE:
            client.query(`DELETE FROM category WHERE id='${payload.id}'`);
            sendToOtherSessions(action, ws);
            break;


        case TASK_CREATE:
            client.query(`INSERT INTO task(id, category, title, description, completed) VALUES('${payload.id}', '${payload.category}', '${payload.title}', '${payload.description}', ${payload.completed})`);
            sendToOtherSessions(action, ws);
            break;


        case TASK_UPDATE:
            client.query(`UPDATE task SET category='${payload.category}', title='${payload.title}', description='${payload.description}', completed=${payload.completed}  WHERE id='${payload.id}'`);
            sendToOtherSessions(action, ws);
            break;


        case TASK_DELETE:
            client.query(`DELETE FROM task WHERE id='${payload.id}'`);
            sendToOtherSessions(action, ws);
            break;
    }
};