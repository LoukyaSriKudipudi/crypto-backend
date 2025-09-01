const cryptoController = require("../controllers/crypto");
const express = require("express");
const router = express.Router();
const upload = require("../utilities/multer");

// Middleware to catch Multer errors
function handleMulterError(req, res, next) {
  return (err, reqInner, resInner, nextInner) => {
    if (err) {
      return resInner
        .status(400)
        .json({ success: false, message: err.message });
    }
    nextInner();
  };
}

// ---------------- File Encryption ----------------
router.post(
  "/encryptFile",
  upload.single("file"),
  handleMulterError(),
  cryptoController.encryptFile
);

// ---------------- Download Encrypted File ----------------
router.get(
  "/downloadEncryptedFile/:filename",
  cryptoController.sendEncryptedFile
);

// ---------------- File Decryption ----------------
router.post(
  "/decryptFile",
  upload.single("file"),
  handleMulterError(),
  cryptoController.decryptFile
);

// ---------------- Download Decrypted File ----------------
router.get(
  "/downloadDecryptedFile/:filename",
  cryptoController.sendDecryptedFile
);

// ---------------- Text Encryption/Decryption ----------------
router.post("/encryptText", cryptoController.encryptText);
router.post("/decryptText", cryptoController.decryptText);

router.post("/testUpload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");
  res.send({
    message: "File received",
    filename: req.file.filename,
    size: req.file.size,
    path: req.file.path,
  });
});

module.exports = router;
