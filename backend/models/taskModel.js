const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A task must have a title.'],
      trim: true,
      maxlength: [100, 'A task title must be 100 characters or less.'],
      minlength: [3, 'A task title must be at least 3 characters.'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be 500 characters or less.'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    // Phase to which this task (goal) belongs
    phase: {
      type: Number,
      required: true,
      default: 1,
    },

  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
