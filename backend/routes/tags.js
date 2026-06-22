const express = require('express');
const { Op } = require('sequelize');
const { Tag, Article, ArticleTag } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { createSlug, createUniqueSlug } = require('../utils/slug');

const router = express.Router();

const makeTagSlug = (name) => {
  const slug = createSlug(name, 'tag');
  return slug === 'tag' ? createUniqueSlug(name, 'tag') : slug;
};

const countPublishedArticles = (tagId) => Article.count({
  where: { status: 'published' },
  include: [
    {
      model: Tag,
      as: 'tags',
      where: { id: tagId },
      required: true,
      through: { attributes: [] }
    }
  ],
  distinct: true
});

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({ order: [['createdAt', 'DESC']] });

    const tagsWithCount = await Promise.all(
      tags.map(async (tag) => {
        const count = await countPublishedArticles(tag.id);
        return { ...tag.toJSON(), articleCount: count };
      })
    );

    res.json(tagsWithCount);
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByPk(id);

    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }

    const articleCount = await countPublishedArticles(id);
    res.json({ ...tag.toJSON(), articleCount });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: '标签名称不能为空' });
    }

    const slug = makeTagSlug(name);
    const existingTag = await Tag.findOne({
      where: {
        [Op.or]: [{ name }, { slug }]
      }
    });

    if (existingTag) {
      return res.status(400).json({ message: '标签已存在' });
    }

    const tag = await Tag.create({ name, slug });
    res.status(201).json({ message: '标签创建成功', tag });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const tag = await Tag.findByPk(id);

    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }

    if (name !== undefined && name !== tag.name) {
      const slug = makeTagSlug(name);
      const duplicate = await Tag.findOne({
        where: {
          id: { [Op.ne]: id },
          [Op.or]: [{ name }, { slug }]
        }
      });

      if (duplicate) {
        return res.status(400).json({ message: '标签已存在' });
      }

      tag.name = name;
      tag.slug = slug;
    }

    await tag.save();

    res.json({ message: '标签更新成功', tag });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByPk(id);

    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }

    const articleCount = await ArticleTag.count({ where: { tagId: id } });

    if (articleCount > 0) {
      return res.status(400).json({ message: '该标签下存在文章，无法删除' });
    }

    await tag.destroy();

    res.json({ message: '标签删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

module.exports = router;
