const express = require("express");
const verifyToken = require("../middleware/auth");
const { upload } = require("../config/multerConfig");
const {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
} = require("../controllers/postsControllers");
const router = express.Router();

router.post("/post", verifyToken, upload.single("image"), createPost);
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.patch("/:id", verifyToken, likePost);

module.exports = router;
