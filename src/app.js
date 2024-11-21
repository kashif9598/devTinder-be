const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Error occured in saving");
  }
});

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
app.delete('/user', async(req, res) => {
  const userId = req.body.userId
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully")
  } catch (error) {
    res.status(400).send("Something went wrong")
  }
})

// update user
app.patch('/user', async(req,res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    await User.findByIdAndUpdate(userId, data);
    res.send('User updated successfully');
  } catch (error) {
    res.status(400).send('Something went wrong')
  }
})

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
