const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "server/public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.png`);
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
