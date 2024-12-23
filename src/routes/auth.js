const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require('bcrypt');
const User = require("../models/user");
const req = require("express/lib/request");

const authRouter = express.Router();

//signup api
authRouter.post("/signup", async (req, res) => {
  try {
    //validate data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    //encrypt password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

//login api
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // create jwt token
      const token = await user.getJWT();
      // send jwt token as cookie
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.status(200).send("Login Successfull");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post('/logout', async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  }).send('Logout successfull')
})

module.exports = authRouter;
