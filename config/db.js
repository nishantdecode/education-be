const { Sequelize } = require('sequelize');
require('dotenv').config();
""

// const databaseUrl = "postgresql://postgres:root@localhost:5432/edmertion"
const databaseUrl = "postgresql://postgres:In6pdCFMshk3co1AHLJi@database-1.ch6ii0g4gbxu.ap-south-1.rds.amazonaws.com:5432/edmertion"


const match = databaseUrl.match(/^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
if (!match) {
  throw new Error('DATABASE_URL is not correctly formatted');
}

const [, username, password, host, port, database] = match;

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: 'postgres',
});

module.exports = sequelize;
