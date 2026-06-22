const express = require('express');
const { Op } = require('sequelize');
const { Category, Article } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { createSlug, createUniqueSlug } = require('../utils/slug');

const router = express.Router();

const makeCategorySlug = (name) => {
  const slug = createSlug(name, 'category');
  return slug === 'category' ? createUniqueSlug(name, 'category') : slug;
};

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
    });

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Article.count({
          where: { categoryId: category.id, status: 'published' }
        });
        return { ...category.toJSON(), articleCount: count };
      })
    );

    res.json(categoriesWithCount);
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }

    const articleCount = await Article.count({
      where: { categoryId: id, status: 'published' }
    });

    res.json({ ...category.toJSON(), articleCount });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, sortOrder } = req.body;

    if (!name) {
      return res.status(400).json({ message: '分类名称不能为空' });
    }

    const slug = makeCategorySlug(name);
    const existingCategory = await Category.findOne({
      where: {
        [Op.or]: [{ name }, { slug }]
      }
    });

    if (existingCategory) {
      return res.status(400).json({ message: '分类已存在' });
    }

    const category = await Category.create({
      name,
      slug,
      description: description || null,
      sortOrder: sortOrder || 0
    });

    res.status(201).json({ message: '分类创建成功', category });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, sortOrder } = req.body;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }

    if (name !== undefined && name !== category.name) {
      const slug = makeCategorySlug(name);
      const duplicate = await Category.findOne({
        where: {
          id: { [Op.ne]: id },
          [Op.or]: [{ name }, { slug }]
        }
      });

      if (duplicate) {
        return res.status(400).json({ message: '分类已存在' });
      }

      category.name = name;
      category.slug = slug;
    }
    if (description !== undefined) category.description = description || null;
    if (sortOrder !== undefined) category.sortOrder = sortOrder;

    await category.save();

    res.json({ message: '分类更新成功', category });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }

    const articleCount = await Article.count({ where: { categoryId: id } });

    if (articleCount > 0) {
      return res.status(400).json({ message: '该分类下存在文章，无法删除' });
    }

    await category.destroy();

    res.json({ message: '分类删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

module.exports = router;
