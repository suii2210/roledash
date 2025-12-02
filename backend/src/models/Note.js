const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '', trim: true },
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);

