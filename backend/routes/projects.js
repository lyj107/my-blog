const express = require('express');
const { Project } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, coverImage, demoUrl, githubUrl, techStack, status, sortOrder } = req.body;

    if (!name) {
      return res.status(400).json({ message: '项目名称不能为空' });
    }

    const project = await Project.create({
      name,
      description: description || null,
      coverImage: coverImage || null,
      demoUrl: demoUrl || null,
      githubUrl: githubUrl || null,
      techStack: techStack || null,
      status: status || 'active',
      sortOrder: sortOrder || 0
    });

    res.status(201).json({ message: '项目创建成功', project });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, coverImage, demoUrl, githubUrl, techStack, status, sortOrder } = req.body;
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description || null;
    if (coverImage !== undefined) project.coverImage = coverImage || null;
    if (demoUrl !== undefined) project.demoUrl = demoUrl || null;
    if (githubUrl !== undefined) project.githubUrl = githubUrl || null;
    if (techStack !== undefined) project.techStack = techStack || null;
    if (status !== undefined) project.status = status;
    if (sortOrder !== undefined) project.sortOrder = sortOrder;

    await project.save();

    res.json({ message: '项目更新成功', project });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }

    await project.destroy();

    res.json({ message: '项目删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

module.exports = router;
