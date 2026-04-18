import { readFileSync } from "fs";
import type { ReadStream } from "fs";
import type { HttpClient } from "../http.js";
import type { UploadResult, UploadOptions } from "../types.js";
import { encryptImage } from "../crypto.js";

export class Upload {
  constructor(private readonly http: HttpClient) {}

  async image(uuid: string, file: Buffer | ReadStream | string, options: UploadOptions = {}): Promise<UploadResult> {
    const buffer = this.toBuffer(file);
    const filename = options.filename ?? "image.jpg";
    const mimeType = options.mimeType ?? "image/jpeg";

    const formData = new FormData();
    formData.append("file", new Blob([new Uint8Array(buffer)], { type: mimeType }), filename);
    if (options.source) formData.append("source", options.source);

    const headers: Record<string, string> = {};
    if (options.password) headers["x-session-password"] = options.password;

    return this.http.request<UploadResult>(`/api/v1/upload/${uuid}/images`, {
      method: "POST",
      body: formData as any,
      headers,
    });
  }

  async imageEncrypted(
    uuid: string,
    file: Buffer | ReadStream | string,
    publicKey: string,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    const buffer = this.toBuffer(file);
    const filename = options.filename ?? "image.jpg";
    const mimeType = options.mimeType ?? "image/jpeg";

    const encrypted = encryptImage(buffer, publicKey);

    const payload = JSON.stringify({
      ...encrypted,
      filename,
      mimeType,
      source: options.source ?? "sdk",
    });

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Aptr-Encrypted": "default",
    };
    if (options.password) headers["x-session-password"] = options.password;

    return this.http.request<UploadResult>(`/api/v1/upload/${uuid}/images`, {
      method: "POST",
      body: payload,
      headers,
    });
  }

  private toBuffer(file: Buffer | ReadStream | string): Buffer {
    if (Buffer.isBuffer(file)) return file;
    if (typeof file === "string") return readFileSync(file);
    const stream = file as ReadStream;
    const path = stream.path;
    if (typeof path === "string") return readFileSync(path);
    throw new Error("Unsupported file input. Use Buffer, file path string, or ReadStream with a path.");
  }
}
