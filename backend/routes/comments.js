const express = require('express');
const { Op } = require('sequelize');
const { Comment, User, Article } = require('../models');
const { authenticateToken, optionalAuthenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

const parsePositiveInt = (value, fallback, max = 100) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
};

router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { articleId, status } = req.query;
    const page = parsePositiveInt(req.query.page, 1, 10000);
    const limit = parsePositiveInt(req.query.limit, 10, 100);
    const offset = (page - 1) * limit;

    const where = {};
    if (articleId) where.articleId = articleId;
    if (status) where.status = status;

    const { count, rows: comments } = await Comment.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'nickname', 'avatar'] },
        { model: Article, as: 'article', attributes: ['id', 'title'] }
      ],
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    });

    res.json({ comments, total: count, page, limit });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.get('/article/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;

    const comments = await Comment.findAll({
      where: { articleId, status: 'approved' },
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'nickname', 'avatar'] }],
      order: [['createdAt', 'ASC']]
    });

    res.json(buildNestedComments(comments));
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

function buildNestedComments(comments) {
  const commentMap = new Map();
  const rootComments = [];

  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment.toJSON(), children: [] });
  });

  comments.forEach((comment) => {
    const commentData = commentMap.get(comment.id);
    if (comment.parentId && commentMap.has(comment.parentId)) {
      commentMap.get(comment.parentId).children.push(commentData);
    } else {
      rootComments.push(commentData);
    }
  });

  return rootComments;
}

router.post('/', optionalAuthenticateToken, async (req, res) => {
  try {
    const { articleId, content, parentId, guestName } = req.body;
    const cleanedContent = String(content || '').trim();

    if (!articleId || !cleanedContent) {
      return res.status(400).json({ message: '文章 ID 和评论内容不能为空' });
    }

    const article = await Article.findByPk(articleId);
    if (!article || article.status !== 'published') {
      return res.status(404).json({ message: '文章不存在' });
    }

    if (parentId) {
      const parent = await Comment.findOne({ where: { id: parentId, articleId } });
      if (!parent) {
        return res.status(400).json({ message: '父评论不存在' });
      }
    }

    const commentData = {
      articleId,
      content: cleanedContent,
      parentId: parentId || null,
      guestName: req.user ? null : String(guestName || '').trim().slice(0, 50) || null,
      status: req.user ? 'approved' : 'pending'
    };

    if (req.user) {
      commentData.userId = req.user.id;
    }

    const comment = await Comment.create(commentData);
    const createdComment = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'nickname', 'avatar'] }]
    });

    res.status(201).json({ message: '评论提交成功', comment: createdComment });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { content, status } = req.body;
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    if (req.user.role !== 'admin' && comment.userId !== req.user.id) {
      return res.status(403).json({ message: '无权限修改此评论' });
    }

    if (content !== undefined) comment.content = String(content).trim();
    if (status && req.user.role === 'admin') comment.status = status;

    await comment.save();

    res.json({ message: '评论更新成功', comment });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    if (req.user.role !== 'admin' && comment.userId !== req.user.id) {
      return res.status(403).json({ message: '无权限删除此评论' });
    }

    await Comment.destroy({
      where: {
        [Op.or]: [{ id }, { parentId: id }]
      }
    });

    res.json({ message: '评论删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

module.exports = router;
