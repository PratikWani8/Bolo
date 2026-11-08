const express = require('express');
const router = express.Router();
const { getAnalytics, getUnansweredQueries, getUsers } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));
router.get('/analytics', getAnalytics);
router.get('/unanswered-queries', getUnansweredQueries);
router.get('/users', getUsers);

module.exports = router;
