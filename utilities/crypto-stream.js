const crypto = require("crypto");
const { pipeline } = require("stream/promises");
const fsp = require("fs/promises");
const fs = require("fs");
const path = require("path");
const { buffer } = require("stream/consumers");

function scryptKey(salt, encryptionSecret) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(encryptionSecret, salt, 32, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

async function encryptFile(input, output, encryptionSecret) {
  const iv = crypto.randomBytes(12);
  const salt = crypto.randomBytes(16);
  const key = await scryptKey(salt, encryptionSecret);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  await fsp.mkdir(path.dirname(output), { recursive: true });
  const inputStream = fs.createReadStream(input);
  const outputStream = fs.createWriteStream(output);

  outputStream.write(iv);
  outputStream.write(salt);

  await pipeline(inputStream, cipher, outputStream);
  const authTag = cipher.getAuthTag();
  await fsp.appendFile(output, authTag);
}

async function decryptFile(input, output, decryptionSecret) {
  const fd = await fsp.open(input, "r");
  const iv = Buffer.alloc(12);
  await fd.read(iv, 0, 12, 0);
  const salt = Buffer.alloc(16);
  await fd.read(salt, 0, 16, 12);
  const stats = await fd.stat();
  const authTag = Buffer.alloc(16);
  await fd.read(authTag, 0, 16, stats.size - 16);
  await fd.close();

  const key = await scryptKey(salt, decryptionSecret);

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  const inputStream = fs.createReadStream(input, {
    start: 28,
    end: stats.size - 17,
  });
  await fsp.mkdir(path.dirname(output), { recursive: true });

  const outputStream = fs.createWriteStream(output);
  await pipeline(inputStream, decipher, outputStream);
}

module.exports = { encryptFile, decryptFile };
