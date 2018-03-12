const session = require('./session');
const db = require('./db/models');

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
    session.getList().forEach(ws => {
        if(currentWs !== ws){
            ws.send(action);
        }
    });
};


module.exports = (action, ws) => {
    const {type, payload = {}} = JSON.parse(action);
    console.log('[WebSocket Message]',type, payload);
    switch (type) {
        case SYNC_CLIENT:
            db.category.findAll({
                attributes: ['id','title']
            }).then(result => {
              ws.send(JSON.stringify({
                    type: CATEGORY_SYNC,
                    payload: result
                }));
            }, err => {
                console.log(err.stack);
                //TODO send event back to save in sync queue
            });

            db.task.findAll({
                attributes: ['id','category','title','description','completed']
            }).then(result => {
              ws.send(JSON.stringify({
                    type: TASK_SYNC,
                    payload: result
                }));
            }, err => {
                console.log(err.stack);
                //TODO send event back to save in sync queue
            });

            break;


        case CATEGORY_CREATE:
            db.category.create(payload);
            sendToOtherSessions(action, ws);
            break;


        case CATEGORY_UPDATE:
            db.category.update(payload, {where: {id: payload.id}});
            sendToOtherSessions(action, ws);
            break;


        case CATEGORY_DELETE:
            db.category.destroy({where: {id: payload.id}});
            db.task.destroy({where: {category: payload.id}});
            sendToOtherSessions(action, ws);
            break;


        case TASK_CREATE:
            db.task.create(payload);
            sendToOtherSessions(action, ws);
            break;


        case TASK_UPDATE:
            db.task.update(payload, {where: {id: payload.id}});
            sendToOtherSessions(action, ws);
            break;


        case TASK_DELETE:
            db.task.destroy({where: {id: payload.id}});
            sendToOtherSessions(action, ws);
            break;
    }
};