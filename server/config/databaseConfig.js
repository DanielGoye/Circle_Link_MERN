require("dotenv").config();
const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connection successful");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { dbConnect };
