const Sequelize = require('sequelize');

console.log('Init Database connection with  params: ',JSON.stringify({
    RDS_HOSTNAME: process.env.RDS_HOSTNAME,
    RDS_PORT: process.env.RDS_PORT,
    RDS_DB_NAME: process.env.RDS_DB_NAME,
    RDS_USERNAME: process.env.RDS_USERNAME
}));
module.exports = new Sequelize(process.env.RDS_DB_NAME, process.env.RDS_USERNAME, process.env.RDS_PASSWORD, {
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});