const Sequelize = require('sequelize');
const {name, host} = require('../config/index')

const db = new Sequelize(name, "", "", {
    host: host,
    logging: false,
    dialect: 'postgres'
})

module.exports = db;