const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    //read the token from req cookies
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("You are not logged in.")
    }
    //verify the jwt token
    const decodedObj = jwt.verify(token, "Kashif@DEV9598");

    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};
