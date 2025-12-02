const express = require('express');
const { z } = require('zod');

const Task = require('../models/Task');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const createSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title is required'),
    description: z.string().max(500).optional(),
    status: z.enum(['todo', 'in-progress', 'done']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dueDate: z.coerce.date().optional()
  })
});

const updateSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    description: z.string().max(500).optional(),
    status: z.enum(['todo', 'in-progress', 'done']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dueDate: z.union([z.coerce.date(), z.null()]).optional()
  })
});

const querySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.enum(['todo', 'in-progress', 'done']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional()
  })
});

router.use(auth);

router.get('/', validate(querySchema), async (req, res, next) => {
  try {
    const { search, status, priority } = req.query;
    const filter = { owner: req.userId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
});

router.post('/', validate(createSchema), async (req, res, next) => {
  try {
    const payload = { ...req.body, owner: req.userId };
    if (payload.dueDate) payload.dueDate = new Date(payload.dueDate);
    const task = await Task.create(payload);
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', validate(updateSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.dueDate) updates.dueDate = new Date(updates.dueDate);
    if (updates.dueDate === null) updates.dueDate = undefined;

    const task = await Task.findOneAndUpdate({ _id: id, owner: req.userId }, updates, {
      new: true
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, owner: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
