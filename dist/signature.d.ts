/**
 * Verify an image delivery webhook signature.
 * Header: X-Apertur-Signature: sha256=<hex>
 * Calculation: HMAC-SHA256(body, secret)
 */
export declare function verifyWebhookSignature(body: string | Buffer, signature: string, secret: string): boolean;
/**
 * Verify an event webhook signature (HMAC SHA256 method).
 * Headers: X-Apertur-Signature: sha256=<hex>, X-Apertur-Timestamp: <unix seconds>
 * Calculation: HMAC-SHA256(${timestamp}.${body}, secret)
 */
export declare function verifyEventSignature(body: string, timestamp: string, signature: string, secret: string): boolean;
/**
 * Verify an event webhook signature (Svix method).
 * Headers: svix-id, svix-timestamp, svix-signature: v1,<base64>
 * Calculation: HMAC-SHA256(${svixId}.${timestamp}.${body}, Buffer.from(secret, 'hex'))
 */
export declare function verifySvixSignature(body: string, svixId: string, timestamp: string, signature: string, secret: string): boolean;
