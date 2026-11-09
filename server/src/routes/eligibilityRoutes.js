const express = require('express');
const router = express.Router();
const { checkEligibility } = require('../controllers/eligibilityController');

router.post('/check', checkEligibility);

module.exports = router;
