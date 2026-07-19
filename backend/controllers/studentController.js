const studentService = require('../services/studentService');
const catchAsync = require('../utils/catchAsync');

/**
 * Student Controller
 * Handles HTTP requests and delegates to the service layer.
 */

// POST /api/students
exports.createStudent = catchAsync(async (req, res, next) => {
  const student = await studentService.createStudent(req.body);

  res.status(201).json({
    success: true,
    message: 'Student created successfully',
    data: student,
  });
});

// GET /api/students
exports.getAllStudents = catchAsync(async (req, res, next) => {
  const students = await studentService.getAllStudents();

  res.status(200).json({
    success: true,
    message: 'Students retrieved successfully',
    data: students,
  });
});

// GET /api/students/:id
exports.getStudentById = catchAsync(async (req, res, next) => {
  const student = await studentService.getStudentById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Student retrieved successfully',
    data: student,
  });
});

// PUT /api/students/:id
exports.updateStudent = catchAsync(async (req, res, next) => {
  const student = await studentService.updateStudent(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Student updated successfully',
    data: student,
  });
});

// DELETE /api/students/:id
exports.deleteStudent = catchAsync(async (req, res, next) => {
  await studentService.deleteStudent(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Student deleted successfully',
    data: null,
  });
});
