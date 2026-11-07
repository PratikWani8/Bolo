const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  audioUrl: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  intent: {
    type: String,
    default: 'general_query',
  },
  sources: [
    {
      title: String,
      url: String,
      department: String,
      confidence: Number,
    },
  ],
  suggestedFollowUps: [String],
  detectedLanguage: {
    type: String,
    default: 'mr',
  },
});

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    language: {
      type: String,
      default: 'mr',
    },
    title: {
      type: String,
      default: 'New Voice Assistance Session',
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Conversation', conversationSchema);
