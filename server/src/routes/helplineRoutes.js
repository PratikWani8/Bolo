const express = require('express');
const router = express.Router();
const {
  getHelplines,
  createHelpline,
  updateHelpline,
  deleteHelpline,
} = require('../controllers/helplineController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getHelplines);

// Admin-only endpoints
router.post('/', protect, authorize('admin'), createHelpline);
router.put('/:id', protect, authorize('admin'), updateHelpline);
router.delete('/:id', protect, authorize('admin'), deleteHelpline);

module.exports = router;
