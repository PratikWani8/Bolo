const express = require('express');
const router = express.Router();
const {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
  getCategories,
} = require('../controllers/schemeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/categories/summary', getCategories);
router.get('/', getSchemes);
router.get('/:id', getSchemeById);

// Admin-only endpoints
router.post('/', protect, authorize('admin'), createScheme);
router.put('/:id', protect, authorize('admin'), updateScheme);
router.delete('/:id', protect, authorize('admin'), deleteScheme);

module.exports = router;
