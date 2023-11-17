const { Sequelize } = require('sequelize');

// Manually set the connection parameters
const sequelize = new Sequelize(
  'postgres',          // Replace with your database name
  'edmertion_admin',   // Replace with your database username
  'edmertiondb',       // Replace with your database password
  {
    host: 'database-1.cw9wtxumnjt5.ap-south-1.rds.amazonaws.com', // Replace with your database host
    port: 5432, // Replace with your database port
    dialect: 'postgres',
  }
);

module.exports = sequelize;
