const sequelize = require('../db');
const Sequelize = require('sequelize');

module.exports = sequelize.define('category', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true
    },
    title: Sequelize.STRING,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
});