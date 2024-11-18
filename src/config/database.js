const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://kashifsheikh9598:UOtgcDpGkrHFpWYI@namastenode.yzgdf.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
