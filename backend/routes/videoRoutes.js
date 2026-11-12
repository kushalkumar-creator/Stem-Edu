const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { requireAuth } = require('../middleware/auth');

router.get('/', videoController.getVideos);
router.get('/:id', videoController.getVideoById);
router.post('/:id/progress', requireAuth, videoController.saveVideoProgress);

module.exports = router;

