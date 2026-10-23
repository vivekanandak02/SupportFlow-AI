const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  isAi: { type: Boolean, default: false },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ticketSchema = new mongoose.Schema({
  _id: {
    type: String
  },
  ticketNumber: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Technical', 'Billing', 'Account Access', 'Feature Request', 'General Inquiry'],
    required: true,
    default: 'General Inquiry'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    required: true,
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  assignedTeam: {
    type: String,
    default: 'Customer Support'
  },
  assignedTo: {
    type: String,
    default: 'Unassigned'
  },
  createdBy: {
    _id: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  aiAnalysis: {
    confidence: { type: Number, default: 0.85 },
    matchedKeywords: [{ type: String }],
    reasoning: { type: String }
  },
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
