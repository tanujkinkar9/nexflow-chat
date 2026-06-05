const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'system'], default: 'text' }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
