const express = require('express');
const router = express.Router();
const { signup, login, getProfile, updateProfile, deleteUserData } = require('../controllers/authController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Public auth routes
router.post('/signup', signup);
router.post('/login', login);

// Authenticated user data deletion (P2-15.2 Right to Erasure)
router.post('/delete-data', requireAuth, deleteUserData);

module.exports = router;

