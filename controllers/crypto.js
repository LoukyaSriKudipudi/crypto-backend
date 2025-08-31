const { encryptFile, decryptFile } = require("../utilities/crypto-stream");
const { encryptText, decryptText } = require("../utilities/crypto-text");
const path = require("path");
const fs = require("fs/promises");

// ------------------- File Encryption -------------------
exports.encryptFile = async (req, res) => {
  try {
    const outputPath = path.join(
      __dirname,
      "..",
      "encrypted-files",
      `${Date.now()}-encrypted-${req.file.originalname}`
    );

    await encryptFile(req.file.path, outputPath, req.body.encryptionKey);
    await fs.unlink(req.file.path); // delete original file

    const fileName = path.basename(outputPath);
    console.log("File encrypted successfully:", fileName);

    res.json({
      success: true,
      message: "File encrypted successfully.",
      downloadUrl: `${req.protocol}://${req.get(
        "host"
      )}/api/downloadEncryptedFile/${fileName}`,
    });
  } catch (err) {
    console.error("File encryption error:", err);
    res.status(500).json({
      success: false,
      message: "File encryption failed. Please check your key or file.",
    });
  }
};

// ------------------- Send Encrypted File -------------------
exports.sendEncryptedFile = (req, res) => {
  const filepath = path.join(
    __dirname,
    "..",
    "encrypted-files",
    req.params.filename
  );
  res.download(filepath, async (err) => {
    if (err) {
      console.error("Error sending encrypted file:", err);
    } else {
      try {
        await fs.unlink(filepath);
        console.log("Encrypted file deleted:", filepath);
      } catch (unlinkErr) {
        console.error("Error deleting encrypted file:", unlinkErr);
      }
    }
  });
};

// ------------------- File Decryption -------------------
exports.decryptFile = async (req, res) => {
  try {
    const outputPath = path.join(
      __dirname,
      "..",
      "decrypted-files",
      `${Date.now()}-decrypted-${req.file.originalname}`
    );

    await decryptFile(req.file.path, outputPath, req.body.decryptionKey);
    await fs.unlink(req.file.path); // delete encrypted file

    const fileName = path.basename(outputPath);
    console.log("File decrypted successfully:", fileName);

    // When generating download URL
    res.json({
      success: true,
      message: "File encrypted successfully.",
      downloadUrl: `/api/downloadDecryptedFile/${fileName}`,
    });
  } catch (err) {
    console.error("File decryption error:", err);
    res.status(500).json({
      success: false,
      message: "File decryption failed. Wrong key or corrupted file.",
    });
  }
};

// ------------------- Send Decrypted File -------------------
exports.sendDecryptedFile = (req, res) => {
  const filepath = path.join(
    __dirname,
    "..",
    "decrypted-files",
    req.params.filename
  );
  res.download(filepath, async (err) => {
    if (err) {
      console.error("Error sending decrypted file:", err);
    } else {
      try {
        await fs.unlink(filepath);
        console.log("Decrypted file deleted:", filepath);
      } catch (unlinkErr) {
        console.error("Error deleting decrypted file:", unlinkErr);
      }
    }
  });
};

// ------------------- Text Encryption -------------------
exports.encryptText = async (req, res) => {
  try {
    const encryptedText = await encryptText(
      req.body.text,
      req.body.encryptionKey
    );

    res.status(200).json({
      success: true,
      message: "Text encrypted successfully.",
      encryptedText,
    });
  } catch (err) {
    console.error("Text encryption error:", err);
    res.status(500).json({
      success: false,
      message: "Text encryption failed. Check your key or input.",
    });
  }
};

// ------------------- Text Decryption -------------------
exports.decryptText = async (req, res) => {
  try {
    const decryptedText = await decryptText(
      req.body.text,
      req.body.decryptionKey
    );

    res.status(200).json({
      success: true,
      message: "Text decrypted successfully.",
      decryptedText,
    });
  } catch (err) {
    console.error("Text decryption error:", err);
    res.status(500).json({
      success: false,
      message: "Text decryption failed. Wrong key or corrupted text.",
    });
  }
};
