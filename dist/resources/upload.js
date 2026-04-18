"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upload = void 0;
const fs_1 = require("fs");
const crypto_js_1 = require("../crypto.js");
class Upload {
    http;
    constructor(http) {
        this.http = http;
    }
    async image(uuid, file, options = {}) {
        const buffer = this.toBuffer(file);
        const filename = options.filename ?? "image.jpg";
        const mimeType = options.mimeType ?? "image/jpeg";
        const formData = new FormData();
        formData.append("file", new Blob([new Uint8Array(buffer)], { type: mimeType }), filename);
        if (options.source)
            formData.append("source", options.source);
        const headers = {};
        if (options.password)
            headers["x-session-password"] = options.password;
        return this.http.request(`/api/v1/upload/${uuid}/images`, {
            method: "POST",
            body: formData,
            headers,
        });
    }
    async imageEncrypted(uuid, file, publicKey, options = {}) {
        const buffer = this.toBuffer(file);
        const filename = options.filename ?? "image.jpg";
        const mimeType = options.mimeType ?? "image/jpeg";
        const encrypted = (0, crypto_js_1.encryptImage)(buffer, publicKey);
        const payload = JSON.stringify({
            ...encrypted,
            filename,
            mimeType,
            source: options.source ?? "sdk",
        });
        const headers = {
            "Content-Type": "application/json",
            "X-Aptr-Encrypted": "default",
        };
        if (options.password)
            headers["x-session-password"] = options.password;
        return this.http.request(`/api/v1/upload/${uuid}/images`, {
            method: "POST",
            body: payload,
            headers,
        });
    }
    toBuffer(file) {
        if (Buffer.isBuffer(file))
            return file;
        if (typeof file === "string")
            return (0, fs_1.readFileSync)(file);
        const stream = file;
        const path = stream.path;
        if (typeof path === "string")
            return (0, fs_1.readFileSync)(path);
        throw new Error("Unsupported file input. Use Buffer, file path string, or ReadStream with a path.");
    }
}
exports.Upload = Upload;
