const express = require("express");
const authRouter = express.Router();
const User = require("../Models/user");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateSignupData } = require("../utils/validation");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

// Multer config for temporary storage
const upload = multer({ dest: "uploads/" });

// Utility: create and send JWT cookie
const sendToken = (user, res) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

// ✅ SIGNUP with optional photo upload
authRouter.post("/signup", upload.single("photo"), async (req, res) => {
  try {
    validateSignupData(req);

    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      about,
      skills,
    } = req.body;

    // Check for existing email
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Upload image to Cloudinary if exists
    let photoURL = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_photos",
      });
      photoURL = result.secure_url; // short CDN URL
      fs.unlinkSync(req.file.path); // remove temp file
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      about,
      skills,
      photoURL,
    });

    await newUser.save();

    // Send JWT token cookie
    sendToken(newUser, res);

    res.status(200).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(400).send("ERROR: " + err.message);
  }
});

// ✅ LOGIN
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    // Send JWT token cookie
    sendToken(user, res);

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(400).send("ERROR: " + err.message);
  }
});

// ✅ LOGOUT
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).send("User logged out successfully");
});

module.exports = authRouter;
