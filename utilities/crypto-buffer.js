const crypto = require("crypto");

function scryptKey(salt, encryptionSecret) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(encryptionSecret, salt, 32, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}
async function encryptFileBuffer(fileBuffer) {
  const iv = crypto.randomBytes(12);
  const salt = crypto.randomBytes(16);
  const key = await scryptKey(password, salt);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, salt, encrypted, authTag]);
}

async function decryptFileBuffer(encryptedBuffer) {
  if (encryptedBuffer.length < 44) throw new Error("Invalid encrypted file");

  const iv = encryptedBuffer.subarray(0, 12);
  const salt = encryptedBuffer.subarray(12, 28);
  const tag = encryptedBuffer.subarray(encryptedBuffer.length - 16);
  const cipherText = encryptedBuffer.subarray(28, encryptedBuffer.length - 16);

  const key = await scryptKey(password, salt);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(cipherText),
    decipher.final(),
  ]);
  return decrypted;
}
