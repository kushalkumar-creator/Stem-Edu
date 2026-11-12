const express = require('express');
const router = express.Router();
const { getLessonSummary } = require('../controllers/summaryController');
const { optionalAuth } = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');

// POST /api/lessons/:id/summary (Rate limited for AI generation)
router.post('/lessons/:id/summary', optionalAuth, aiRateLimiter, getLessonSummary);

module.exports = router;

