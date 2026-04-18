export interface EncryptedPayload {
    encryptedKey: string;
    iv: string;
    encryptedData: string;
    algorithm: string;
}
export declare function encryptImage(imageBuffer: Buffer, publicKeyPem: string): EncryptedPayload;
