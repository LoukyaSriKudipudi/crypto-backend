const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function scryptKey(salt, encryptionSecret) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(encryptionSecret, salt, 32, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

async function encryptFile(input, output, encryptionSecret) {
  const fileBuffer = fs.readFileSync(input);
  const iv = crypto.randomBytes(12);
  const salt = crypto.randomBytes(16);
  const key = await scryptKey(salt, encryptionSecret);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  fs.mkdirSync(path.dirname(output), { recursive: true });

  const encryptedFile = Buffer.concat([
    cipher.update(fileBuffer),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  const package = Buffer.concat([iv, salt, encryptedFile, authTag]);

  fs.writeFileSync(output, package);
}

// const inputPath = path.join(
//   __dirname,
//   //   "..",
//   "original-files",
//   "normalfile.txt"
// );
// const outputPath = path.join(
//   __dirname,
//   //   "..",
//   "encrypted-files",
//   `${Date.now()}-encryptedfile.bin`
// );
// const encryptionSecret = "avbvcedreafvgehnikjaksalimdngurgaopqrstuvdurgawxyz";

// encryptFile(inputPath, outputPath, encryptionSecret);

async function decryptFile(input, output, decryptionSecret) {
  const fileBuffer = fs.readFileSync(input);

  const iv = fileBuffer.subarray(0, 12);
  const salt = fileBuffer.subarray(12, 28);
  const key = await scryptKey(salt, decryptionSecret);
  const encryptedFile = fileBuffer.subarray(28, fileBuffer.length - 16);
  const authTag = fileBuffer.subarray(fileBuffer.length - 16);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);

  fs.mkdirSync(path.dirname(output), { recursive: true });

  decipher.setAuthTag(authTag);
  const decryptedFile = Buffer.concat([
    decipher.update(encryptedFile),
    decipher.final(),
  ]);

  fs.writeFileSync(output, decryptedFile);
}

// const inputPath = path.join(
//   __dirname,

//   "encrypted-files",
//   "1756581356904-encryptedfile.bin"
// );
// const outputPath = path.join(
//   __dirname,
//   "decrypted-files",
//   `${Date.now()}-decryptedfile.txt`
// );
// const decryptionSecret = "avbvcedreafvgehnikjaksalimdngurgaopqrstuvdurgawxyz";

// decryptFile(inputPath, outputPath, decryptionSecret);

module.exports = { encryptFile, decryptFile };
