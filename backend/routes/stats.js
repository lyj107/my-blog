const express = require('express');
const { Op, fn, col } = require('sequelize');
const { Article, Category, Tag, Comment, Project } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = {
      articles: {
        total: await Article.count(),
        published: await Article.count({ where: { status: 'published' } }),
        draft: await Article.count({ where: { status: 'draft' } }),
        archived: await Article.count({ where: { status: 'archived' } })
      },
      categories: await Category.count(),
      tags: await Tag.count(),
      comments: {
        total: await Comment.count(),
        approved: await Comment.count({ where: { status: 'approved' } }),
        pending: await Comment.count({ where: { status: 'pending' } }),
        rejected: await Comment.count({ where: { status: 'rejected' } })
      },
      projects: {
        total: await Project.count(),
        active: await Project.count({ where: { status: 'active' } }),
        completed: await Project.count({ where: { status: 'completed' } })
      }
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.get('/articles/monthly', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const targetYear = Number.parseInt(req.query.year, 10) || new Date().getFullYear();

    const result = await Article.findAll({
      attributes: [
        [fn('MONTH', col('createdAt')), 'month'],
        [fn('COUNT', col('id')), 'count']
      ],
      where: {
        createdAt: {
          [Op.between]: [
            new Date(targetYear, 0, 1, 0, 0, 0),
            new Date(targetYear, 11, 31, 23, 59, 59)
          ]
        }
      },
      group: ['month'],
      order: [[fn('MONTH', col('createdAt')), 'ASC']]
    });

    const monthlyData = Array(12).fill(0);
    result.forEach((item) => {
      const monthIndex = Number.parseInt(item.dataValues.month, 10) - 1;
      monthlyData[monthIndex] = Number.parseInt(item.dataValues.count, 10);
    });

    res.json({ year: targetYear, data: monthlyData });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.get('/articles/top', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: { status: 'published' },
      order: [['viewCount', 'DESC']],
      limit: 10,
      attributes: ['id', 'title', 'viewCount', 'likeCount']
    });

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

module.exports = router;
