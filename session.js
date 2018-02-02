const list = [];

module.exports = {
    add(session) {
        list.push(session);
    },
    remove(session) {
        list.splice(list.indexOf(session))
    },
    getList(){
        return list;
    }
};
