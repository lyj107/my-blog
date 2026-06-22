const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Tag = require('./Tag');
const Article = require('./Article');
const Comment = require('./Comment');
const Project = require('./Project');
const ArticleTag = require('./ArticleTag');

Article.belongsTo(Category, { foreignKey: 'categoryId', as: 'category', onDelete: 'RESTRICT' });
Category.hasMany(Article, { foreignKey: 'categoryId', as: 'articles', onDelete: 'RESTRICT' });

Article.belongsTo(User, { foreignKey: 'authorId', as: 'author', onDelete: 'RESTRICT' });
User.hasMany(Article, { foreignKey: 'authorId', as: 'articles', onDelete: 'RESTRICT' });

Article.belongsToMany(Tag, {
  through: ArticleTag,
  as: 'tags',
  foreignKey: 'articleId',
  otherKey: 'tagId',
  onDelete: 'CASCADE'
});
Tag.belongsToMany(Article, {
  through: ArticleTag,
  as: 'articles',
  foreignKey: 'tagId',
  otherKey: 'articleId',
  onDelete: 'CASCADE'
});

Article.hasMany(Comment, { foreignKey: 'articleId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Article, { foreignKey: 'articleId', as: 'article', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'SET NULL' });
Comment.belongsTo(Comment, { foreignKey: 'parentId', as: 'parent', onDelete: 'CASCADE' });
Comment.hasMany(Comment, { foreignKey: 'parentId', as: 'children', onDelete: 'CASCADE' });

module.exports = {
  sequelize,
  User,
  Category,
  Tag,
  Article,
  Comment,
  Project,
  ArticleTag
};
