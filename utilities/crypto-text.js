const crypto = require("crypto");

function scryptKey(salt, encryptionSecret) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(encryptionSecret, salt, 32, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

async function encryptText(value, encryptionSecret) {
  const iv = crypto.randomBytes(12);
  const salt = crypto.randomBytes(16);
  const key = await scryptKey(salt, encryptionSecret);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encryptedText = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  const package = Buffer.concat([iv, salt, encryptedText, authTag]);
  return package.toString("base64");
}

async function decryptText(value, decryptionSecret) {
  const bufferValue = Buffer.from(value, "base64");
  const iv = bufferValue.subarray(0, 12);
  const salt = bufferValue.subarray(12, 28);
  const key = await scryptKey(salt, decryptionSecret);
  const encryptedText = bufferValue.subarray(28, bufferValue.length - 16);
  const authTag = bufferValue.subarray(bufferValue.length - 16);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  const decryptedText = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decryptedText.toString("utf8");
}

module.exports = { encryptText, decryptText };
