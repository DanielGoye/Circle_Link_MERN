const express = require("express");
const { upload } = require("../config/multerConfig");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authControllers");
const router = express.Router();

router.post("/register", upload.single("picture"), register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

module.exports = router;
