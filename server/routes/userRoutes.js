const express = require("express");
const {
  getUser,
  getUserFriends,
  addRemoveFriend,
} = require("../controllers/userControllers");
const  verifyToken  = require("../middleware/auth");

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

module.exports = router;
