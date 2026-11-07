const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Scheme name is required'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Agriculture',
        'Education',
        'Healthcare',
        'Women Empowerment',
        'Employment',
        'Housing',
        'Financial Assistance',
        'Social Welfare',
        'Rural Development',
      ],
      index: true,
    },
    benefits: [
      {
        type: String,
        required: true,
      },
    ],
    eligibility: {
      minAge: { type: Number, default: 0 },
      maxAge: { type: Number, default: 120 },
      gender: { type: String, enum: ['All', 'Female', 'Male', 'Transgender'], default: 'All' },
      applicableStates: [{ type: String, default: 'All India' }],
      occupations: [{ type: String }],
      maxIncome: { type: Number, default: null },
      isFarmerOnly: { type: Boolean, default: false },
      criteriaText: { type: String, required: true },
    },
    requiredDocuments: [
      {
        name: { type: String, required: true },
        description: { type: String, default: '' },
        mandatory: { type: Boolean, default: true },
      },
    ],
    applicationSteps: [
      {
        type: String,
        required: true,
      },
    ],
    officialUrl: {
      type: String,
      required: [true, 'Official verified URL is required'],
      trim: true,
    },
    state: {
      type: String,
      default: 'All India',
      index: true,
    },
    governmentDepartment: {
      type: String,
      required: true,
      trim: true,
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
    helpline: {
      type: String,
      default: '',
    },
    tags: [{ type: String }],
    translations: {
      mr: {
        name: String,
        description: String,
        benefits: [String],
      },
      hi: {
        name: String,
        description: String,
        benefits: [String],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Full text search index
schemeSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Scheme', schemeSchema);
