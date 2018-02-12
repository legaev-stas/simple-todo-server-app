module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.createTable('test', {
                id: {
                    type: Sequelize.UUID,
                    primaryKey: true
                },
                title: Sequelize.STRING
            })
        ]);
    },

    down: function (queryInterface) {
        return Promise.all([
            queryInterface.dropTable('test')
        ]);
    }
};