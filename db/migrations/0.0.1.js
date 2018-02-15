module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.createTable('categories', {
                id: {
                    type: Sequelize.UUID,
                    primaryKey: true
                },
                title: Sequelize.STRING,
                createdAt: Sequelize.DATE,
                updatedAt: Sequelize.DATE
            }),
            queryInterface.createTable('tasks', {
                id: {
                    type: Sequelize.UUID,
                    primaryKey: true
                },
                category: Sequelize.UUID,
                title: Sequelize.STRING,
                description: Sequelize.STRING,
                completed: Sequelize.BOOLEAN,
                createdAt: Sequelize.DATE,
                updatedAt: Sequelize.DATE
            })
        ]);
    },

    down: function (queryInterface) {
        return Promise.all([
            queryInterface.dropTable('categories'),
            queryInterface.dropTable('tasks')
        ]);
    }
};