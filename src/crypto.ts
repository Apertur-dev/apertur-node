import { createPublicKey, publicEncrypt, randomBytes, createCipheriv } from "crypto";

export interface EncryptedPayload {
  encryptedKey: string;
  iv: string;
  encryptedData: string;
  algorithm: string;
}

export function encryptImage(imageBuffer: Buffer, publicKeyPem: string): EncryptedPayload {
  // Generate random AES-256 key and IV
  const aesKey = randomBytes(32);
  const iv = randomBytes(12);

  // Encrypt image with AES-256-GCM
  const cipher = createCipheriv("aes-256-gcm", aesKey, iv);
  const encrypted = Buffer.concat([cipher.update(imageBuffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const encryptedWithTag = Buffer.concat([encrypted, authTag]);

  // Wrap AES key with RSA-OAEP
  const pubKey = createPublicKey(publicKeyPem);
  const wrappedKey = publicEncrypt(
    { key: pubKey, oaepHash: "sha256", padding: 4 /* RSA_PKCS1_OAEP_PADDING */ },
    aesKey,
  );

  return {
    encryptedKey: wrappedKey.toString("base64"),
    iv: iv.toString("base64"),
    encryptedData: encryptedWithTag.toString("base64"),
    algorithm: "RSA-OAEP+AES-256-GCM",
  };
}
