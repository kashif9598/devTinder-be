const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const app = express();
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
