const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false, // Prevents password from being returned in query results by default
    },
    role: {
      type: String,
      enum: {
        values: ['Student', 'Mentor', 'Admin'],
        message: 'Role must be either Student, Mentor, or Admin',
      },
      default: 'Student',
    },
    campus: {
      type: String,
      required: [true, 'Please select your campus'],
      enum: {
        values: ['Dantewada', 'Sarjapur', 'Kishanganj', 'Raigarh'],
        message: 'Campus must be Dantewada, Sarjapur, Kishanganj, or Raigarh',
      },
    },
    gender: {
      type: String,
      required: [true, 'Please select your gender'],
      enum: {
        values: ['Male', 'Female'],
        message: 'Gender must be either Male or Female',
      },
    },
    joiningDate: {
      type: Date,
      required: [true, 'Please provide your joining date'],
    },
    currentPhase: {
      type: Number,
      default: 1,
    },
    avatarUrl: {
      type: String,
      default: function () {
        return `https://i.pravatar.cc/150?u=${this.email}`;
      },
    },
    streak: {
      type: Number,
      default: 0,
    },
    interviewScore: {
      type: Number,
      default: 0,
    },
    achievements: {
      type: [String],
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save middleware to hash the password before saving it to the database.
 * Runs on save() and create() operations.
 */
userSchema.pre('save', async function () {
  // Only run this function if the password was actually modified
  if (!this.isModified('password')) return;

  // Hash the password with a cost factor of 12
  this.password = await bcrypt.hash(this.password, 12);
});

/**
 * Instance method to check if a provided password matches the hashed password.
 */
userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
