const validator = require("validator");

const validateSignUpData = (firstName, lastName, emailId, password) => {
  if (!firstName) {
    return "FirstName is not valid";
  } else if (!lastName) {
    return "Lastname is not valid";
  } else if (!validator.isEmail(emailId)) {
    return "Email ID is not valid";
  } else if (!validator.isStrongPassword(password)) {
    return "Password is too weak";
  }
};

// validate profile edit data
const validateProfileEditData = (req) => {
  const updatedData = req.body;
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "skills",
    "about",
  ];
  const GENDER_ALLOWED = ["male", "female", "others"];
  let isUpdateAllowed = true;
  if (
    !Object.keys(updatedData).every((field) => ALLOWED_UPDATES.includes(field))
  ) {
    isUpdateAllowed = false;
  } else if (updatedData?.firstName?.length > 50) {
    isUpdateAllowed = false;
  } else if (updatedData?.lastName?.length > 50) {
    isUpdateAllowed = false;
  } else if (updatedData.photoUrl && !validator.isURL(updatedData?.photoUrl)) {
    isUpdateAllowed = false;
  } else if (updatedData?.skills?.length > 50) {
    isUpdateAllowed = false;
  } else if (updatedData?.about?.length > 200) {
    isUpdateAllowed = false;
  } else if (updatedData?.age < 15 && updatedData?.age > 90) {
    isUpdateAllowed = false;
  } else if (
    updatedData.gender &&
    !GENDER_ALLOWED.includes(updatedData?.gender)
  ) {
    isUpdateAllowed = false;
  }

  return isUpdateAllowed;
};

// validate strong password
const validateStrongPassword = (req) => {
  const { password } = req.body;
  return validator.isStrongPassword(password) ? true : false;
};

module.exports = {
  validateSignUpData,
  validateProfileEditData,
  validateStrongPassword,
};
