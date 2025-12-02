const express = require('express');
const bcrypt = require('bcryptjs');
const { z } = require('zod');

const User = require('../models/User');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const updateSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    bio: z.string().max(240).optional(),
    github: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    portfolio: z.string().url().optional().or(z.literal('')),
    contactEmail: z.string().email().optional().or(z.literal(''))
  })
});

const passwordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters')
  })
});

router.get('/', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
});

router.put('/', auth, validate(updateSchema), async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.bio !== undefined) updates.bio = req.body.bio;
    if (req.body.github !== undefined) updates.github = req.body.github;
    if (req.body.linkedin !== undefined) updates.linkedin = req.body.linkedin;
    if (req.body.portfolio !== undefined) updates.portfolio = req.body.portfolio;
    if (req.body.contactEmail !== undefined) updates.contactEmail = req.body.contactEmail;

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true });
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
});

router.put('/password', auth, validate(passwordSchema), async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newHash;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
