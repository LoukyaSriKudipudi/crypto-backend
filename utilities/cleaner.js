const fs = require("fs");
const path = require("path");

const encryptedFilesDir = path.join(__dirname, "..", "encrypted-files");
const decryptedFilesDir = path.join(__dirname, "..", "decrypted-files");

setInterval(() => {
  [encryptedFilesDir, decryptedFilesDir].forEach((dir) => {
    fs.readdir(dir, (err, files) => {
      if (err) return;
      files.forEach((file) => {
        const filePath = path.join(dir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) return;
          const now = Date.now();
          const age = (now - stats.mtimeMs) / 1000;
          if (age > 60) {
            fs.unlink(filePath, () => {});
          }
        });
      });
    });
  });
}, 60 * 1000);
