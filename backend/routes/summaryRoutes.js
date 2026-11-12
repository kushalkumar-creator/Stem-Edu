const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');
const { optionalAuth, requireAuth } = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');

// Phase 1 backward-compatible lesson summary
router.post('/lessons/:id/summary', optionalAuth, aiRateLimiter, summaryController.getLessonSummary);

// Phase 2 Advanced Summaries & Flashcards Engine (P2-4)
router.post('/summaries/generate', optionalAuth, aiRateLimiter, summaryController.generateAdvancedSummary);
router.get('/summaries', requireAuth, summaryController.getSavedSummaries);
router.delete('/summaries/:id', requireAuth, summaryController.deleteSummary);

module.exports = router;
