const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();

//signup api
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "An account already exists with this Email ID" });
    }
    //validate data
    const validationError = validateSignUpData(
      firstName,
      lastName,
      emailId,
      password
    );
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    //encrypt password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const createdUser = await user.save();
    // create jwt token
    const token = await user.getJWT();
    // send jwt token as cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.json(createdUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//login api
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(404).send("No User Found with this Email ID");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // create jwt token
      const token = await user.getJWT();
      // send jwt token as cookie
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.status(200).json({ message: "Login Successfull", data: user });
    } else {
      return res.status(401).send("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logout successfull");
});

module.exports = authRouter;
