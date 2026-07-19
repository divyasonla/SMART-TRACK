const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Please provide a password"],
      select: false,
    },

    campus: {
      type: String,
      enum: ["Dantewada", "Sarjapur", "Kishanganj", "Raigarh"],
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Hash Password pre-save hook (checks if already hashed)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  if (this.password && this.password.startsWith("$2")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;