"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptImage = encryptImage;
const crypto_1 = require("crypto");
function encryptImage(imageBuffer, publicKeyPem) {
    // Generate random AES-256 key and IV
    const aesKey = (0, crypto_1.randomBytes)(32);
    const iv = (0, crypto_1.randomBytes)(12);
    // Encrypt image with AES-256-GCM
    const cipher = (0, crypto_1.createCipheriv)("aes-256-gcm", aesKey, iv);
    const encrypted = Buffer.concat([cipher.update(imageBuffer), cipher.final()]);
    const authTag = cipher.getAuthTag();
    const encryptedWithTag = Buffer.concat([encrypted, authTag]);
    // Wrap AES key with RSA-OAEP
    const pubKey = (0, crypto_1.createPublicKey)(publicKeyPem);
    const wrappedKey = (0, crypto_1.publicEncrypt)({ key: pubKey, oaepHash: "sha256", padding: 4 /* RSA_PKCS1_OAEP_PADDING */ }, aesKey);
    return {
        encryptedKey: wrappedKey.toString("base64"),
        iv: iv.toString("base64"),
        encryptedData: encryptedWithTag.toString("base64"),
        algorithm: "RSA-OAEP+AES-256-GCM",
    };
}
