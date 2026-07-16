const express = require('express');
const studentController = require('../controllers/studentController');

const router = express.Router();

// Route group for /api/students
router
  .route('/')
  .get(studentController.getAllStudents)
  .post(studentController.createStudent);

// Route group for /api/students/:id
router
  .route('/:id')
  .get(studentController.getStudentById)
  .put(studentController.updateStudent)
  .delete(studentController.deleteStudent);

module.exports = router;
