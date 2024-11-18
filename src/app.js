const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.post('/signup', async (req, res) => {
  const userObj = {
    firstName: 'Kashif',
    lastName: 'Sheikh',
    age: 26,
    emailId: 'kashif.sheikh@google.com',
    password: 'Kashif@123'
  }

  const user = new User(userObj);

  try {
    await user.save();
    res.send('User added successfully')
  } catch (error) {
    res.status(400).send('Error occured in saving')
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
 