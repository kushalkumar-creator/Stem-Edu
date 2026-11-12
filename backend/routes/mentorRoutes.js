const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const { requireAuth } = require('../middleware/auth');

// All mentor endpoints require authentication
router.use(requireAuth);

// Direct single-endpoint chat (finds or creates active session)
router.post('/chat', mentorController.directChat);

// Session management
router.post('/sessions', mentorController.createSession);
router.get('/sessions', mentorController.getSessions);
router.get('/sessions/:id', mentorController.getSessionMessages);
router.delete('/sessions/:id', mentorController.deleteSession);

// Messaging within session
router.post('/sessions/:id/messages', mentorController.sendMessage);

// Student persistent memory facts management
router.get('/memories', mentorController.getMemories);
router.delete('/memories/:id', mentorController.deleteMemory);

module.exports = router;
