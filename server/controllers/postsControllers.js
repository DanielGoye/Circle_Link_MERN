const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { Post } = require("../models/posts");
const { User } = require("../models/user");

const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const user = await User.findById(userId);
    const result = await cloudinary.uploader.upload(
      `${req.file.destination}/${req.file.filename}`,
      {
        folder: "Circle_Link/Posts",
        use_filename: true,
        resource_type: "image",
      }
    );
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath: result.secure_url,
      likes: {},
      comments: [],
    });
    await newPost.save();
    fs.unlink(`${req.file.destination}/${req.file.filename}`, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    res.status(500).send(error.message);
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    res.status(404).send(error.message);
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId });
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    res.status(404).send(error.message);
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    res.status(404).send(error.message);
  }
};

module.exports = { createPost, getFeedPosts, getUserPosts, likePost };
