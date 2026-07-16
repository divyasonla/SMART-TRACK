const express = require('express');
const progressController = require('../controllers/progressController');

const router = express.Router();

// Route group for /api/progress
router
  .route('/')
  .get(progressController.getAllProgress)
  .post(progressController.createProgress);

// Route group for /api/progress/:id
router
  .route('/:id')
  .get(progressController.getProgressById)
  .put(progressController.updateProgress)
  .delete(progressController.deleteProgress);

module.exports = router;
