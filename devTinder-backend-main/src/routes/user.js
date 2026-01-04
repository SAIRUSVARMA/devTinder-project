const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../Middlewares/auth");
const { ConnectionRequestModel } = require("../Models/connectionRequest");
const User = require("../Models/user");

const USER_SAFE_DATA = "firstName lastName photoURL about age gender skills";

const DEFAULT_USER_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

// ========== REQUESTS RECEIVED ==========
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    connectionRequests.forEach((r) => {
      if (!r.fromUserId.photoURL) r.fromUserId.photoURL = DEFAULT_USER_IMAGE;
    });

    res.status(200).json({ connectionRequests });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

// ========== CONNECTIONS ==========
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      const otherUser =
        String(row.fromUserId._id) === String(loggedInUser._id)
          ? row.toUserId
          : row.fromUserId;

      if (!otherUser.photoURL) otherUser.photoURL = DEFAULT_USER_IMAGE;

      return otherUser;
    });

    res.status(200).json({ data });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

// ========== FEED (FIXED) ==========
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // find all connection requests where current user is involved
    const requests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    // collect IDs to hide
    const excludeIds = new Set();
    requests.forEach((r) => {
      excludeIds.add(String(r.fromUserId));
      excludeIds.add(String(r.toUserId));
    });

    // always hide current user too
    excludeIds.add(String(loggedInUser._id));

    // fetch allowed users
    const users = await User.find({
      _id: { $nin: Array.from(excludeIds) },
    }).select(USER_SAFE_DATA);

    // default photos
    users.forEach((u) => {
      if (!u.photoURL) u.photoURL = DEFAULT_USER_IMAGE;
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

// ========== UPDATE PROFILE ==========
userRouter.patch("/user/update", userAuth, async (req, res) => {
  try {
    const allowed = [
      "firstName",
      "lastName",
      "about",
      "age",
      "gender",
      "skills",
      "photoURL",
    ];

    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    if (typeof updates.skills === "string") {
      updates.skills = updates.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser.photoURL) updatedUser.photoURL = DEFAULT_USER_IMAGE;

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(400).send("ERROR updating profile: " + error.message);
  }
});

// ========== UPDATE ONLY PHOTO ==========
userRouter.patch("/user/update-photo", userAuth, async (req, res) => {
  try {
    const { photoURL } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { photoURL },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(400).send("ERROR updating photo:" + error.message);
  }
});

module.exports = userRouter;
