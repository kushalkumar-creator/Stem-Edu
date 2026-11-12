const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { requireAuth } = require('../middleware/auth');

router.get('/channels', communityController.getChannels);
router.get('/channels/:slug/messages', communityController.getMessages);
router.post('/channels/:slug/messages', requireAuth, communityController.postMessage);

module.exports = router;

