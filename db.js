// db.js
const { Sequelize, DataTypes } = require('sequelize');

// Configure the database connection
const sequelize = new Sequelize('postgres', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres'
});

// Define the Document model
const Document = sequelize.define('Document', {
  documentName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  documentURL: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'Documents'
});

module.exports = { sequelize, Document };
