"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encryption = void 0;
class Encryption {
    http;
    constructor(http) {
        this.http = http;
    }
    async getServerKey() {
        return this.http.request("/api/v1/encryption/server-key");
    }
}
exports.Encryption = Encryption;
