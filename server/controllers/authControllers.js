require("dotenv").config();

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { User } = require("../models/user");
const sendMail = require("../utils/sendEmail");

const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const result = await cloudinary.uploader.upload(
      `${req.file.destination}/${req.file.filename}`,
      {
        folder: "Circle_Link/Profile_Pictures",
        use_filename: true,
        resource_type: "image",
      }
    );
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hash,
      picturePath: result.secure_url,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000),
    });

    const savedUser = await newUser.save();
    fs.unlink(`${req.file.destination}/${req.file.filename}`, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    res.status(201).json(savedUser);
  } catch (error) {
    console.log(error);
    const e = new Error(error);
    res.status(500).send(e.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).send("This account does not exist");
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).send("Wrong password");
      } else {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
        delete user.password;
        res.status(200).json({ token, user });
      }
    }
  } catch (error) {
    console.log(error);
    const e = new Error(error);
    res.status(500).send(e.message);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetPasswordExpire = Date.now() + 10 * (60 * 1000);
    const foundUser = await User.findOneAndUpdate(
      { email },
      {
        resetPasswordToken,
        resetPasswordExpire,
      },
      { new: true }
    );
    if (!foundUser) {
      res.status(404).json("Email does not exist.");
      return;
    }
    const resetPasswordUrl = `${process.env.SITEURL}/password-reset/${resetToken}`;
    const message = `
      <h1>You have requested to reset your password.</h1>
      <p>Please go to this link to reset your password.</p>
      <a href=${resetPasswordUrl} clicktracking=false>${resetPasswordUrl}</a>
    `;
    try {
      const sendResult = await sendMail({
        to: email,
        subject: "Password reset request",
        text: message,
      });
      if (sendResult.success) {
        res.status(200).json("Email sent");
        return;
      } else {
        res.status(500).json("Some error occurred.");
        return;
      }
    } catch (error) {
      await User.findOneAndUpdate(
        { email },
        {
          resetPasswordToken: undefined,
          resetPasswordExpire: undefined,
        },
        { new: true }
      );
      console.log(error);
      res.status(500).json(Error(error).message);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(Error(error).message);
  }
};

const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  try {
    const foundUser = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!foundUser) {
      res.status(400).json("Invalid reset token");
      return;
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(req.body.password, salt);
    foundUser.password = hash;
    foundUser.resetPasswordToken = undefined;
    foundUser.resetPasswordExpire = undefined;
    await foundUser.save();
    res
      .status(200)
      .json({ success: true, message: "Password successfully changed" });
  } catch (error) {
    console.log(error);
    res.status(500).json(new Error(error).message);
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
