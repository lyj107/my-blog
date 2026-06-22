const express = require('express');
const { Op } = require('sequelize');
const { sequelize, Article, Category, Tag, User } = require('../models');
const { authenticateToken, optionalAuthenticateToken } = require('../middleware/auth');
const { createUniqueSlug } = require('../utils/slug');

const router = express.Router();

const parsePositiveInt = (value, fallback, max = 100) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
};

const isPrivilegedUser = (user) => user && ['admin', 'editor'].includes(user.role);

const buildDateRange = (year, month) => {
  const parsedYear = Number.parseInt(year, 10);
  if (!Number.isFinite(parsedYear)) return null;

  if (month) {
    const parsedMonth = Number.parseInt(month, 10);
    if (!Number.isFinite(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) return null;
    return [
      new Date(parsedYear, parsedMonth - 1, 1, 0, 0, 0),
      new Date(parsedYear, parsedMonth, 0, 23, 59, 59)
    ];
  }

  return [
    new Date(parsedYear, 0, 1, 0, 0, 0),
    new Date(parsedYear, 11, 31, 23, 59, 59)
  ];
};

router.get('/', optionalAuthenticateToken, async (req, res) => {
  try {
    const {
      categoryId,
      tagId,
      keyword,
      status,
      year,
      month
    } = req.query;

    const page = parsePositiveInt(req.query.page, 1, 10000);
    const limit = parsePositiveInt(req.query.limit, 10, 100);
    const offset = (page - 1) * limit;
    const privileged = isPrivilegedUser(req.user);

    const where = {};
    if (privileged) {
      if (status) where.status = status;
    } else {
      where.status = 'published';
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { content: { [Op.like]: `%${keyword}%` } }
      ];
    }

    const dateRange = buildDateRange(year, month);
    if (dateRange) {
      where.createdAt = { [Op.between]: dateRange };
    }

    const include = [
      { model: Category, as: 'category' },
      { model: User, as: 'author', attributes: ['id', 'username', 'nickname', 'avatar'] },
      {
        model: Tag,
        as: 'tags',
        through: { attributes: [] },
        ...(tagId ? { where: { id: tagId }, required: true } : {})
      }
    ];

    const { count, rows: articles } = await Article.findAndCountAll({
      where,
      include,
      offset,
      limit,
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    res.json({ articles, total: count, page, limit });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.get('/:slug', optionalAuthenticateToken, async (req, res) => {
  try {
    const { slug } = req.params;
    const where = Number.isNaN(Number(slug)) ? { slug } : { id: Number.parseInt(slug, 10) };

    const article = await Article.findOne({
      where,
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'author', attributes: ['id', 'username', 'nickname', 'avatar'] },
        { model: Tag, as: 'tags', through: { attributes: [] } }
      ]
    });

    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }

    const canViewUnpublished =
      req.user && (req.user.role === 'admin' || article.authorId === req.user.id);

    if (article.status !== 'published' && !canViewUnpublished) {
      return res.status(404).json({ message: '文章不存在' });
    }

    article.viewCount += 1;
    await article.save();

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { title, content, excerpt, coverImage, categoryId, tagIds, status } = req.body;

    if (!title || !content || !categoryId) {
      await transaction.rollback();
      return res.status(400).json({ message: '标题、内容和分类不能为空' });
    }

    const articleStatus = status || 'draft';
    const article = await Article.create({
      title,
      slug: createUniqueSlug(title, 'article'),
      content,
      excerpt: excerpt || content.substring(0, 200),
      coverImage: coverImage || null,
      categoryId,
      authorId: req.user.id,
      status: articleStatus,
      publishedAt: articleStatus === 'published' ? new Date() : null
    }, { transaction });

    if (Array.isArray(tagIds) && tagIds.length > 0) {
      await article.addTags(tagIds, { transaction });
    }

    await transaction.commit();

    const createdArticle = await Article.findByPk(article.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags', through: { attributes: [] } }
      ]
    });

    res.status(201).json({ message: '文章创建成功', article: createdArticle });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { title, content, excerpt, coverImage, categoryId, tagIds, status } = req.body;

    const article = await Article.findByPk(id, { transaction });

    if (!article) {
      await transaction.rollback();
      return res.status(404).json({ message: '文章不存在' });
    }

    if (req.user.role !== 'admin' && article.authorId !== req.user.id) {
      await transaction.rollback();
      return res.status(403).json({ message: '无权限修改此文章' });
    }

    if (title !== undefined && title !== article.title) {
      article.title = title;
      article.slug = createUniqueSlug(title, 'article');
    }
    if (content !== undefined) article.content = content;
    if (excerpt !== undefined) article.excerpt = excerpt;
    if (coverImage !== undefined) article.coverImage = coverImage || null;
    if (categoryId !== undefined) article.categoryId = categoryId;
    if (status !== undefined) {
      article.status = status;
      if (status === 'published' && !article.publishedAt) {
        article.publishedAt = new Date();
      }
    }

    await article.save({ transaction });

    if (Array.isArray(tagIds)) {
      await article.setTags(tagIds, { transaction });
    }

    await transaction.commit();

    const updatedArticle = await Article.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags', through: { attributes: [] } }
      ]
    });

    res.json({ message: '文章更新成功', article: updatedArticle });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const article = await Article.findByPk(id, { transaction });

    if (!article) {
      await transaction.rollback();
      return res.status(404).json({ message: '文章不存在' });
    }

    if (req.user.role !== 'admin' && article.authorId !== req.user.id) {
      await transaction.rollback();
      return res.status(403).json({ message: '无权限删除此文章' });
    }

    await article.setTags([], { transaction });
    await article.destroy({ transaction });
    await transaction.commit();

    res.json({ message: '文章删除成功' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

module.exports = router;
