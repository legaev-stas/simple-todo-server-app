const sequelize = require('../db');
const Sequelize = require('sequelize');

module.exports = sequelize.define('task', {
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
});