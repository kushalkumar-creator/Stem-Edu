const express = require('express');
const router = express.Router();
const virtualController = require('../controllers/virtualController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

// Public or optionally authenticated topic exploration
router.get('/', optionalAuth, virtualController.getTopics);
router.get('/:slug', optionalAuth, virtualController.getTopicBySlug);

// Progress tracking (authenticated)
router.post('/:slug/progress', requireAuth, virtualController.recordProgress);

module.exports = router;

