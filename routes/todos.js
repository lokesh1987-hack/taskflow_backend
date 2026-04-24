const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const syncProjectCounts = async (projectId) => {
  const total = await Todo.countDocuments({ project: projectId });
  const completed = await Todo.countDocuments({ project: projectId, completed: true });
  await Project.findByIdAndUpdate(projectId, { todoCount: total, completedCount: completed });
};

// GET todos for a project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const todos = await Todo.find({ project: req.params.projectId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create todo
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, priority, dueDate, projectId } = req.body;
    if (!title) return res.status(400).json({ message: 'Todo title required' });

    const project = await Project.findOne({ _id: projectId, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const todo = await Todo.create({
      title, description, priority, dueDate: dueDate || null,
      project: projectId, owner: req.user._id
    });
    await syncProjectCounts(projectId);
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update todo
router.put('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    await syncProjectCounts(todo.project);
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    await syncProjectCounts(todo.project);
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
