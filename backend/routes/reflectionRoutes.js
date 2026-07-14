const express = require('express');
const reflectionController = require('../controllers/reflectionController');

const router = express.Router();

// Route group for /api/reflections
router
  .route('/')
  .get(reflectionController.getAllReflections)
  .post(reflectionController.createReflection);

// Route group for /api/reflections/:id
router
  .route('/:id')
  .get(reflectionController.getReflectionById)
  .put(reflectionController.updateReflection)
  .delete(reflectionController.deleteReflection);

module.exports = router;
