const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  coverImage: {
    type: DataTypes.STRING(255),
    defaultValue: null
  },
  demoUrl: {
    type: DataTypes.STRING(255),
    defaultValue: null
  },
  githubUrl: {
    type: DataTypes.STRING(255),
    defaultValue: null
  },
  techStack: {
    type: DataTypes.STRING(255),
    defaultValue: null
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'in_progress'),
    defaultValue: 'active'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'projects'
});

module.exports = Project;