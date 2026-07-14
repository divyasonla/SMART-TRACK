const taskService = require('../services/taskService');
const catchAsync = require('../utils/catchAsync');

/**
 * Controller containing handler functions for Task routes.
 * Utilizes catchAsync to avoid writing try-catch blocks.
 */

// GET /api/v1/tasks
exports.getAllTasks = catchAsync(async (req, res, next) => {
  const tasks = await taskService.getAllTasks();
  
  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: {
      tasks,
    },
  });
});

// GET /api/v1/tasks/:id
exports.getTask = catchAsync(async (req, res, next) => {
  const task = await taskService.getTaskById(req.params.id);
  
  res.status(200).json({
    status: 'success',
    data: {
      task,
    },
  });
});

// POST /api/v1/tasks
exports.createTask = catchAsync(async (req, res, next) => {
  const newTask = await taskService.createTask(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      task: newTask,
    },
  });
});

// PATCH /api/v1/tasks/:id
exports.updateTask = catchAsync(async (req, res, next) => {
  const updatedTask = await taskService.updateTask(req.params.id, req.body);
  
  res.status(200).json({
    status: 'success',
    data: {
      task: updatedTask,
    },
  });
});

// DELETE /api/v1/tasks/:id
exports.deleteTask = catchAsync(async (req, res, next) => {
  await taskService.deleteTask(req.params.id);
  
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
