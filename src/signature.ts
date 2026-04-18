import { createHmac, timingSafeEqual } from "crypto";

/**
 * Verify an image delivery webhook signature.
 * Header: X-Apertur-Signature: sha256=<hex>
 * Calculation: HMAC-SHA256(body, secret)
 */
export function verifyWebhookSignature(body: string | Buffer, signature: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const sig = signature.startsWith("sha256=") ? signature.slice(7) : signature;
  if (expected.length !== sig.length) return false;
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"));
}

/**
 * Verify an event webhook signature (HMAC SHA256 method).
 * Headers: X-Apertur-Signature: sha256=<hex>, X-Apertur-Timestamp: <unix seconds>
 * Calculation: HMAC-SHA256(${timestamp}.${body}, secret)
 */
export function verifyEventSignature(body: string, timestamp: string, signature: string, secret: string): boolean {
  const signatureBase = `${timestamp}.${body}`;
  const expected = createHmac("sha256", secret).update(signatureBase).digest("hex");
  const sig = signature.startsWith("sha256=") ? signature.slice(7) : signature;
  if (expected.length !== sig.length) return false;
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"));
}

/**
 * Verify an event webhook signature (Svix method).
 * Headers: svix-id, svix-timestamp, svix-signature: v1,<base64>
 * Calculation: HMAC-SHA256(${svixId}.${timestamp}.${body}, Buffer.from(secret, 'hex'))
 */
export function verifySvixSignature(body: string, svixId: string, timestamp: string, signature: string, secret: string): boolean {
  const signatureBase = `${svixId}.${timestamp}.${body}`;
  const expectedBuf = Buffer.from(
    createHmac("sha256", Buffer.from(secret, "hex")).update(signatureBase).digest("base64"),
    "base64",
  );
  const sig = signature.startsWith("v1,") ? signature.slice(3) : signature;
  const sigBuf = Buffer.from(sig, "base64");
  if (expectedBuf.length !== sigBuf.length) return false;
  return timingSafeEqual(expectedBuf, sigBuf);
}
