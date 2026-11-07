const mongoose = require('mongoose');

const helplineSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      trim: true,
    },
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    officialSource: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      default: 'All India',
      index: true,
    },
    timings: {
      type: String,
      default: '24x7 / Working Days 9:00 AM - 6:00 PM',
    },
    isTollFree: {
      type: Boolean,
      default: true,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Helpline', helplineSchema);
