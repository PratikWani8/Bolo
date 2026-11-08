const express = require('express');
const router = express.Router();
const {
  createAssistedQuery,
  getAssistedQueries,
  getVolunteerStats,
} = require('../controllers/volunteerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('volunteer', 'admin'));
router.post('/assisted-query', createAssistedQuery);
router.get('/assisted-queries', getAssistedQueries);
router.get('/stats', getVolunteerStats);

module.exports = router;
