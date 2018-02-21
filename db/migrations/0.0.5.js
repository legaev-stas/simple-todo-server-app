module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.createTable('users', {
                id: {
                    type: Sequelize.STRING,
                    primaryKey: true
                },
                firstName: Sequelize.STRING,
                lastName: Sequelize.STRING,
                email: Sequelize.STRING,
                createdAt: Sequelize.DATE,
                updatedAt: Sequelize.DATE
            })
        ]);
    },

    down: function (queryInterface) {
        return Promise.all([
            queryInterface.dropTable('users')
        ]);
    }
};

