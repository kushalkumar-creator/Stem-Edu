const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, notesController.getNotes);
router.post('/', requireAuth, notesController.createNote);
router.put('/:id', requireAuth, notesController.updateNote);
router.delete('/:id', requireAuth, notesController.deleteNote);
router.post('/ocr', requireAuth, notesController.performOCR);

module.exports = router;

