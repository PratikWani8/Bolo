const mongoose = require('mongoose');

const assistedQuerySchema = new mongoose.Schema(
  {
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    citizenReference: {
      type: String,
      required: true,
      trim: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    language: {
      type: String,
      default: 'mr',
    },
    schemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
      default: null,
    },
    schemeName: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['resolved', 'pending_followup', 'referred_to_csc'],
      default: 'resolved',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AssistedQuery', assistedQuerySchema);
