const crypto = require('crypto');
dotenv = require('dotenv');

const algorithm = 'aes-256-cbc';

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(payload) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(payload);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedPayload: encrypted.toString('hex') };
}

function decrypt(payload) {
    let iv = Buffer.from(payload.iv, 'hex');
    let encryptedText = Buffer.from(payload.encryptedPayload, 'hex');

    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

module.exports = {
    encrypt,
    decrypt
}