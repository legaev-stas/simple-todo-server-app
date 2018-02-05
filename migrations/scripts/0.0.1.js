const client = require('../../db');

module.exports = {
    up: function () {
        return Promise.all([
            client.query('CREATE TABLE category (id uuid, title text)'),
            client.query('CREATE TABLE task (id uuid, category uuid, title text, description text, completed boolean)')
        ]);
    },

    down: function () {
        return Promise.all([
            client.query('DROP TABLE category'),
            client.query('DROP TABLE task')
        ]);
    }
};