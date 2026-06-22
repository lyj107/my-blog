const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ArticleTag = sequelize.define('ArticleTag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  articleId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tagId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'article_tags',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['articleId', 'tagId']
    }
  ]
});

module.exports = ArticleTag;
