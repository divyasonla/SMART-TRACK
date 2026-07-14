const express = require('express');
const phaseController = require('../controllers/phaseController');

const router = express.Router();

// Route group for /api/phases
router
  .route('/')
  .get(phaseController.getAllPhases)
  .post(phaseController.createPhase);

// Route group for /api/phases/:id
router
  .route('/:id')
  .get(phaseController.getPhaseById)
  .put(phaseController.updatePhase)
  .delete(phaseController.deletePhase);

module.exports = router;
