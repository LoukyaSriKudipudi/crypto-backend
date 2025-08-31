const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "original-files");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/png",
    "image/jpeg",
    "application/pdf",
    "text/plain",
    "application/zip",
    "video/mp4",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("invalid file type!"), false);
  }
};

const limits = { fileSize: 50 * 1024 * 1024 };

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;
