"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyWebhookSignature = verifyWebhookSignature;
exports.verifyEventSignature = verifyEventSignature;
exports.verifySvixSignature = verifySvixSignature;
const crypto_1 = require("crypto");
/**
 * Verify an image delivery webhook signature.
 * Header: X-Apertur-Signature: sha256=<hex>
 * Calculation: HMAC-SHA256(body, secret)
 */
function verifyWebhookSignature(body, signature, secret) {
    const expected = (0, crypto_1.createHmac)("sha256", secret).update(body).digest("hex");
    const sig = signature.startsWith("sha256=") ? signature.slice(7) : signature;
    if (expected.length !== sig.length)
        return false;
    return (0, crypto_1.timingSafeEqual)(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"));
}
/**
 * Verify an event webhook signature (HMAC SHA256 method).
 * Headers: X-Apertur-Signature: sha256=<hex>, X-Apertur-Timestamp: <unix seconds>
 * Calculation: HMAC-SHA256(${timestamp}.${body}, secret)
 */
function verifyEventSignature(body, timestamp, signature, secret) {
    const signatureBase = `${timestamp}.${body}`;
    const expected = (0, crypto_1.createHmac)("sha256", secret).update(signatureBase).digest("hex");
    const sig = signature.startsWith("sha256=") ? signature.slice(7) : signature;
    if (expected.length !== sig.length)
        return false;
    return (0, crypto_1.timingSafeEqual)(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"));
}
/**
 * Verify an event webhook signature (Svix method).
 * Headers: svix-id, svix-timestamp, svix-signature: v1,<base64>
 * Calculation: HMAC-SHA256(${svixId}.${timestamp}.${body}, Buffer.from(secret, 'hex'))
 */
function verifySvixSignature(body, svixId, timestamp, signature, secret) {
    const signatureBase = `${svixId}.${timestamp}.${body}`;
    const expectedBuf = Buffer.from((0, crypto_1.createHmac)("sha256", Buffer.from(secret, "hex")).update(signatureBase).digest("base64"), "base64");
    const sig = signature.startsWith("v1,") ? signature.slice(3) : signature;
    const sigBuf = Buffer.from(sig, "base64");
    if (expectedBuf.length !== sigBuf.length)
        return false;
    return (0, crypto_1.timingSafeEqual)(expectedBuf, sigBuf);
}
