const cryptoController = require("../controllers/crypto");
const express = require("express");
const router = express.Router();
const upload = require("../utilities/multer");

router.post(
  "/encryptFile",
  upload.single("file"),
  cryptoController.encryptFile
);

router.get(
  "/downloadEncryptedFile/:filename",
  cryptoController.sendEncryptedFile
);

router.post(
  "/decryptFile",
  upload.single("file"),
  cryptoController.decryptFile
);

router.get(
  "/downloadDecryptedFile/:filename",
  cryptoController.sendDecryptedFile
);

router.post("/encryptText", cryptoController.encryptText);
router.post("/decryptText", cryptoController.decryptText);

module.exports = router;
