module.exports = {
  development: {
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    host: '127.0.0.1',
    port: process.env.RDS_PORT,
    dialect: 'postgres'
  },
  test: {
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    dialect: 'postgres'
  },
  production: {
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    dialect: 'postgres'
  }
};
