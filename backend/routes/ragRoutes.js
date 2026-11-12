const express = require('express');
const router = express.Router();
const ragController = require('../controllers/ragController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

// Public or optionally authenticated RAG query
router.post('/query', optionalAuth, ragController.queryKnowledgeBase);

// Private notes knowledge base management (requires authenticated user)
router.post('/notes', requireAuth, ragController.uploadStudentNote);
router.get('/notes', requireAuth, ragController.getStudentNotes);
router.delete('/notes/:id', requireAuth, ragController.deleteStudentNote);

module.exports = router;
