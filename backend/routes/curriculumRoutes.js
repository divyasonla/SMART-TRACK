const express = require('express');
const curriculumController = require('../controllers/curriculumController');

const router = express.Router();

// Seed route: POST /api/curriculum/seed
router.post('/seed', curriculumController.seedCurriculum);

// Complete curriculum route: GET /api/curriculum
router.get('/', curriculumController.getCurriculum);

// Specific phase route: GET /api/curriculum/:idOrSlug
router.get('/:idOrSlug', curriculumController.getPhase);

module.exports = router;
