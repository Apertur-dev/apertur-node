"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const errors_js_1 = require("./errors.js");
class HttpClient {
    baseUrl;
    authHeader;
    constructor(baseUrl, auth) {
        this.baseUrl = baseUrl.replace(/\/+$/, "");
        if (auth.apiKey) {
            this.authHeader = `Bearer ${auth.apiKey}`;
        }
        else if (auth.oauthToken) {
            this.authHeader = `Bearer ${auth.oauthToken}`;
        }
        else {
            this.authHeader = "";
        }
    }
    async request(path, options = {}) {
        const { method = "GET", body, headers = {}, rawResponse = false, signal } = options;
        const reqHeaders = { ...headers };
        if (this.authHeader) {
            reqHeaders["Authorization"] = this.authHeader;
        }
        if (typeof body === "string") {
            reqHeaders["Content-Type"] = reqHeaders["Content-Type"] ?? "application/json";
        }
        const res = await fetch(`${this.baseUrl}${path}`, {
            method,
            headers: reqHeaders,
            body: body,
            signal,
        });
        if (!res.ok) {
            await this.handleError(res);
        }
        if (rawResponse) {
            return res;
        }
        if (res.status === 204) {
            return undefined;
        }
        return res.json();
    }
    async requestBuffer(path, options = {}) {
        const { method = "GET", headers = {} } = options;
        const reqHeaders = { ...headers };
        if (this.authHeader) {
            reqHeaders["Authorization"] = this.authHeader;
        }
        const res = await fetch(`${this.baseUrl}${path}`, { method, headers: reqHeaders });
        if (!res.ok) {
            await this.handleError(res);
        }
        const arrayBuf = await res.arrayBuffer();
        return Buffer.from(arrayBuf);
    }
    async handleError(res) {
        let body = {};
        try {
            body = await res.json();
        }
        catch {
            body = { message: `HTTP ${res.status}` };
        }
        const message = body.message || `HTTP ${res.status}`;
        const code = body.code;
        switch (res.status) {
            case 401:
                throw new errors_js_1.AuthenticationError(message);
            case 404:
                throw new errors_js_1.NotFoundError(message);
            case 429: {
                const retryAfter = parseInt(res.headers.get("Retry-After") ?? "", 10) || undefined;
                throw new errors_js_1.RateLimitError(message, retryAfter);
            }
            case 400:
                throw new errors_js_1.ValidationError(message);
            default:
                throw new errors_js_1.AperturError(res.status, message, code);
        }
    }
}
exports.HttpClient = HttpClient;
