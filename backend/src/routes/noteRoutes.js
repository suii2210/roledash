const express = require('express');
const { z } = require('zod');
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const createSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title is required'),
    content: z.string().max(2000).optional(),
    tags: z.array(z.string()).optional()
  })
});

const updateSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    content: z.string().max(2000).optional(),
    tags: z.array(z.string()).optional()
  })
});

router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const notes = await Note.find({ owner: req.userId }).sort({ updatedAt: -1 });
    res.json({ notes });
  } catch (err) {
    next(err);
  }
});

router.post('/', validate(createSchema), async (req, res, next) => {
  try {
    const note = await Note.create({ ...req.body, owner: req.userId });
    res.status(201).json({ note });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', validate(updateSchema), async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ note });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

