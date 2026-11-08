const rateLimit = require('express-rate-limit');
const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX } = require('../config/env');

const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
});

const voiceUploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 voice queries per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Voice query rate limit exceeded. Please wait a moment before speaking again.',
  },
});

module.exports = { apiLimiter, authLimiter, voiceUploadLimiter };
