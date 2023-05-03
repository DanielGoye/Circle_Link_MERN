const express = require("express");
const { upload } = require("../config/multerConfig");
const { register, login } = require("../controllers/authControllers");
const router = express.Router();

router.post("/register", upload.single("picture"), register);
router.post("/login", login);

module.exports = router;
