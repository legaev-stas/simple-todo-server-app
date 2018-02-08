const list = [];

module.exports = {
    add(session) {
        list.push(session);
        console.log(`[WebSocket] New connection has been opened. Number of connections: ${this.getList().length}`)
    },
    remove(session) {
        list.splice(list.indexOf(session))
        console.log(`[WebSocket] One connection has been closed. Number amount of connections: ${this.getList().length}`)
    },
    getList(){
        return list;
    }
};
