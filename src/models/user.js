const mongoose = require("mongoose");
const validator = require('validator')
const { Schema } = mongoose;


const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50,
    },
    lastName: {
      type: String,
      minLength: 1,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      maxLength: 70,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error('Email ID not valid')
        }
      }
    },
    password: {
      type: String,
      required: true,
      validate(value){
        if(!validator.isStrongPassword(value)){
          throw new Error('Password is too weak !!!')
        }
      }
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://freesvg.org/img/abstract-user-flat-4.png",
      validate(value){
        if(!validator.isURL(value)){
          throw new Error('PhotoURL not valid')
        }
      }
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
