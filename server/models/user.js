const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
      trim: true,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
