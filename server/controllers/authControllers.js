require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

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

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hash,
      picturePath: req.file.filename,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000),
    });

    const savedUser = await newUser.save();
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

module.exports = { register, login };
