const express = require('express');
const router = express.Router();
const {
  getChapterTest,
  getModeTest,
  submitChapterTest,
  getWeakTopics,
  getResults,
  getResultById
} = require('../controllers/practiceController');
const { requireAuth } = require('../middleware/auth');

// Chapter MCQ test routes
router.get('/chapters/:id/test', requireAuth, getChapterTest);
router.post('/chapters/:id/test/submit', requireAuth, submitChapterTest);

// Custom test modes (Chapter, Mixed, Timed)
router.get('/mode-test', requireAuth, getModeTest);

// Result history & weak topics analytics
router.get('/weak-topics', requireAuth, getWeakTopics);
router.get('/results', requireAuth, getResults);
router.get('/results/:id', requireAuth, getResultById);

module.exports = router;
