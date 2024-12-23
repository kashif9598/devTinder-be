const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const {
  validateProfileEditData,
  validateStrongPassword,
} = require("../utils/validation");
const User = require("../models/user");
const profileRouter = express.Router();

//profile api
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//patch profile api
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Data invalid");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach(
      (field) => (loggedInUser[field] = req.body[field])
    );
    const updatedUser = await User.findByIdAndUpdate(
      loggedInUser._id,
      loggedInUser,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );
    res.status(200).json({ message: "Update successfull", data: updatedUser });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//forgot password - password update api
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    if (!validateStrongPassword(req)) {
      throw new Error(
        "Please enter a strong password, Your password should contain minimum 8 characters, minimium 1 lowerCase character, minimum 1 Uppercase character, minimum 1 number and minimum 1 Symbol"
      );
    }
    const { password } = req.body;
    const loggedInUser = req.user;
    const passwordHash = await bcrypt.hash(password, 10);
    loggedInUser.password = passwordHash;
    const updatedUser = await User.findByIdAndUpdate(
      loggedInUser._id,
      loggedInUser,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );
    res
      .status(200)
      .json({ message: "Password changed successfully", data: updatedUser });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Something went wrong when updating password" });
  }
});

module.exports = profileRouter;
