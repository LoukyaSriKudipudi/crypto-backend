const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "original-files");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Allowed MIME types
const allowedMimes = [
  "image/png",
  "image/jpeg",
  "application/pdf",
  "text/plain",
  "application/zip",
  "video/mp4",
];

// Limits: 50MB
const limits = { fileSize: 50 * 1024 * 1024 };

const fileFilter = (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({ storage, limits, fileFilter });

module.exports = upload;
