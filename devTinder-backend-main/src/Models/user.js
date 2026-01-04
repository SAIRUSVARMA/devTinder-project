const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Default fallback image (always a valid URL)
const DEFAULT_USER_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

// User Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter Strong password: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      trim: true,
      validate(value) {
        if (
          value &&
          !["male", "female", "others", "Male", "Female", "Others"].includes(
            value
          )
        ) {
          throw new Error("Not a valid gender (Male, Female, Others)");
        }
      },
    },
    about: {
      type: String,
    },
    photoURL: {
      type: String,
      default: DEFAULT_USER_IMAGE,
      validate(value) {
        // only validate if value is not empty/null
        if (value && !validator.isURL(value, { require_protocol: true })) {
          throw new Error("Invalid URL: " + value);
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Index
userSchema.index({ firstName: 1, lastName: 1 });

// JWT generator
userSchema.methods.getjwt = function () {
  return jwt.sign({ _id: this._id }, "999@Akshad", { expiresIn: "1d" });
};

// Password validator
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  return await bcrypt.compare(passwordInputByUser, this.password);
};

module.exports = mongoose.model("User", userSchema);
