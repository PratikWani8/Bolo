const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
    },
    language: {
      type: String,
      default: 'mr',
      index: true,
    },
    category: {
      type: String,
      default: 'General',
      index: true,
    },
    sourceUrl: {
      type: String,
      default: 'https://myscheme.gov.in',
    },
    verificationStatus: {
      type: String,
      enum: ['verified', 'unverified'],
      default: 'verified',
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    audioUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FAQ', faqSchema);
