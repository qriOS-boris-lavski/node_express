const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('test', 'test', 'test', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
