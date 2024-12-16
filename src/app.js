const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const app = express();

app.use(express.json());

//signup api
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({emailId: emailId})
    if(!user){
      throw new Error('Invalid Credentials')
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(isPasswordValid){
      res.status(200).send('Login Successfull')
    } else {
      throw new Error("Invalid Credentials")
    }
    
  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

//get user by email
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    if (!user) {
      res.status(404).send(`User with email Id ${req.body.emailId} not found`);
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong when fetching the user");
  }
});

// fetch all users
app.get("/feed", async (req, res) => {
  try {
    const userList = await User.find({});
    if (userList.length == 0) {
      res.status(404).send("No users found");
    } else {
      res.send(userList);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// delete user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// update user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    // validation
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "skills",
      "gender",
      "photoUrl",
      "age",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Some fields cannot be updated");
    }

    if (data.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    }).lean();
    res.send(user);
  } catch (error) {
    res.status(400).send("Update Failed: " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(8000, () => {
      console.log(`Server running on PORT 8000`);
    });
  })
  .catch((err) => {
    console.error("Error occured in connecting to Database");
  });
