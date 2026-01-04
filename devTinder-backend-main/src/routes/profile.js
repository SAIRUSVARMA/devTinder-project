const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../Middlewares/auth");
const { validateEditFields } = require("../utils/validation");

// Allowed fields for editing
const ALLOWED_FIELDS = [
  "firstName",
  "lastName",
  "photoURL",
  "age",
  "gender",
  "about",
  "skills",
];

// ✅ GET PROFILE
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user.toObject();
    delete user.password; // remove sensitive info
    res.status(200).json(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// ✅ EDIT PROFILE
profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    // Validate request
    if (!validateEditFields(req)) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;

    // Only update allowed fields
    ALLOWED_FIELDS.forEach((key) => {
      if (req.body[key] !== undefined) {
        loggedInUser[key] = req.body[key];
      }
    });

    await loggedInUser.save();

    const safeUser = loggedInUser.toObject();
    delete safeUser.password; // remove sensitive info

    res.status(200).json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: safeUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
