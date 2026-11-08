const Conversation = require('../models/Conversation');
const memoryStore = require('../utils/memoryStore');
const mongoose = require('mongoose');

// @desc    Get user conversations
// @route   GET /api/conversations
// @access  Private
const getConversations = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;

    if (mongoose.connection.readyState === 1 && userId) {
      const conversations = await Conversation.find({ userId })
        .sort({ updatedAt: -1 })
        .limit(20);
      return res.status(200).json({ success: true, conversations });
    }

    // Memory Store or guest session
    const list = memoryStore.conversations.filter(
      (c) => c.userId === (userId ? String(userId) : 'guest')
    );
    res.status(200).json({ success: true, conversations: list });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single conversation
// @route   GET /api/conversations/:id
// @access  Private
const getConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const conv = await Conversation.findById(id);
      if (!conv) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }
      return res.status(200).json({ success: true, conversation: conv });
    }

    const conv = memoryStore.conversations.find((c) => c._id === id);
    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    res.status(200).json({ success: true, conversation: conv });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete conversation
// @route   DELETE /api/conversations/:id
// @access  Private
const deleteConversation = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      await Conversation.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Conversation deleted' });
    }

    memoryStore.conversations = memoryStore.conversations.filter((c) => c._id !== id);
    res.status(200).json({ success: true, message: 'Conversation deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConversations,
  getConversationById,
  deleteConversation,
};
