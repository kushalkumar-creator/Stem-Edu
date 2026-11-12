const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const contentRoutes = require('./contentRoutes');
const progressRoutes = require('./progressRoutes');
const practiceRoutes = require('./practiceRoutes');
const summaryRoutes = require('./summaryRoutes');
const diagramRoutes = require('./diagramRoutes');
const labRoutes = require('./labRoutes');
const adminRoutes = require('./adminRoutes');
const ragRoutes = require('./ragRoutes');
const mentorRoutes = require('./mentorRoutes');
const virtualRoutes = require('./virtualRoutes');
const notesRoutes = require('./notesRoutes');
const videoRoutes = require('./videoRoutes');
const communityRoutes = require('./communityRoutes');
const { aiRateLimiter } = require('../middleware/rateLimiter');

const { getProfile, updateProfile } = require('../controllers/authController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Authentication routes (/api/auth/signup, /api/auth/login)
router.use('/auth', authRoutes);

// User profile routes
router.get('/me', requireAuth, getProfile);
router.put('/me', requireAuth, updateProfile);

// Content routes (/api/subjects, /api/chapters, /api/lessons)
router.use('/', contentRoutes);

// Progress routes (/api/lessons/:id/complete, /api/progress)
router.use('/', progressRoutes);

// Practice test & results routes (/api/chapters/:id/test, /api/results)
router.use('/', practiceRoutes);

// AI Summary route (/api/lessons/:id/summary)
router.use('/', summaryRoutes);

// Interactive Diagrams route (/api/diagrams)
router.use('/', diagramRoutes);

// Virtual Labs route (/api/labs)
router.use('/labs', labRoutes);

// Virtual Learning 3D Topics route (/api/virtual/*)
router.use('/virtual', virtualRoutes);

// Notes & Handwriting routes (/api/notes/*)
router.use('/notes', notesRoutes);

// Video learning routes (/api/videos/*)
router.use('/videos', videoRoutes);

// Community hub routes (/api/community/*)
router.use('/community', communityRoutes);

// RAG Knowledge Base routes (/api/rag/*)
router.use('/rag', aiRateLimiter, ragRoutes);

// Saarthi AI Mentor & Doubt Solver routes (/api/mentor/*)
router.use('/mentor', aiRateLimiter, mentorRoutes);

// Admin Content Management routes (/api/admin/*)
router.use('/admin', adminRoutes);

// Test routes for middleware verification
router.get('/test-error', (req, res, next) => {
  const error = new Error('Test error: Central error handling is working correctly');
  error.statusCode = 400;
  next(error);
});

router.get('/test/protected', requireAuth, (req, res) => {
  res.status(200).json({
    message: 'Protected route accessed successfully',
    userId: req.user._id,
    role: req.user.role
  });
});

router.get('/test/admin', requireAuth, requireAdmin, (req, res) => {
  res.status(200).json({
    message: 'Admin route accessed successfully',
    userId: req.user._id,
    role: req.user.role
  });
});

module.exports = router;
