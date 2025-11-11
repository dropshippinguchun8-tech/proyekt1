const { Sequelize } = require('sequelize');
const config = require('./env');

const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: 'postgres',
  logging: config.nodeEnv === 'development' ? console.log : false,
});

module.exports = sequelize;
