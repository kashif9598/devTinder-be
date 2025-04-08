const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName photoUrl skills about");
    if (connectionRequests.length === 0) {
      return res.json({ message: "No pending request for this user" });
    }
    res.status(200).json({
      connectionRequests,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName photoUrl skills about")
      .populate("toUserId", "firstName lastName photoUrl skills about");
    if (connectionRequests.length === 0) {
      return res.status(404).json({ message: "No connections found" });
    }
    const connections = connectionRequests.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json(connections);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    // users who should not appear in the feed
    // loggedInuser,
    const loggedInuser = req.user;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInuser._id }, { toUserId: loggedInuser._id }],
    });

    const hiddenUsersFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hiddenUsersFromFeed.add(request.fromUserId.toString()),
        hiddenUsersFromFeed.add(request.toUserId.toString());
    });

    const usersForFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
        { _id: { $ne: loggedInuser._id } },
      ],
    })
      .select("firstName lastName photoUrl skills about age gender")
      .skip(skip)
      .limit(limit);

    res.send(usersForFeed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
