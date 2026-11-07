const mongoose = require('mongoose');

const knowledgeDocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
    },
    fileUrl: {
      type: String,
      default: '',
    },
    sourceUrl: {
      type: String,
      required: [true, 'Official source URL is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Government department is required'],
      trim: true,
    },
    schemeName: {
      type: String,
      default: '',
      trim: true,
    },
    language: {
      type: String,
      default: 'mr',
    },
    state: {
      type: String,
      default: 'All India',
    },
    processingStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    verificationStatus: {
      type: String,
      enum: ['verified', 'under_review', 'unverified'],
      default: 'verified',
    },
    lastVerifiedAt: {
      type: Date,
      default: Date.now,
    },
    chunkCount: {
      type: Number,
      default: 0,
    },
    fileType: {
      type: String,
      default: 'pdf',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    extractedSummary: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('KnowledgeDocument', knowledgeDocumentSchema);
