const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName) {
    throw new Error("FirstName is not valid");
  } else if (!lastName) {
    throw new Error("Lastname is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email ID is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is too weak");
  }
};

module.exports = { validateSignUpData };
