"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sessions = void 0;
class Sessions {
    http;
    constructor(http) {
        this.http = http;
    }
    async create(options = {}) {
        return this.http.request("/api/v1/upload-sessions", {
            method: "POST",
            body: JSON.stringify(options),
        });
    }
    async qr(uuid, options = {}) {
        const params = new URLSearchParams();
        if (options.format)
            params.set("format", options.format);
        if (options.size)
            params.set("size", String(options.size));
        if (options.style)
            params.set("style", options.style);
        if (options.fg)
            params.set("fg", options.fg);
        if (options.bg)
            params.set("bg", options.bg);
        if (options.borderSize)
            params.set("borderSize", String(options.borderSize));
        if (options.borderColor)
            params.set("borderColor", options.borderColor);
        const qs = params.toString();
        return this.http.requestBuffer(`/api/v1/upload-sessions/${uuid}/qr${qs ? `?${qs}` : ""}`);
    }
    async get(uuid) {
        return this.http.request(`/api/v1/upload/${uuid}/session`);
    }
    async update(uuid, options) {
        return this.http.request(`/api/v1/upload-sessions/${uuid}`, {
            method: "PATCH",
            body: JSON.stringify(options),
        });
    }
    async list(params = {}) {
        const qs = new URLSearchParams();
        if (params.page !== undefined)
            qs.set("page", String(params.page));
        if (params.pageSize !== undefined)
            qs.set("pageSize", String(params.pageSize));
        const suffix = qs.toString() ? `?${qs.toString()}` : "";
        return this.http.request(`/api/v1/sessions${suffix}`);
    }
    async recent(params = {}) {
        const qs = new URLSearchParams();
        if (params.limit !== undefined)
            qs.set("limit", String(params.limit));
        const suffix = qs.toString() ? `?${qs.toString()}` : "";
        return this.http.request(`/api/v1/sessions/recent${suffix}`);
    }
    async verifyPassword(uuid, password) {
        return this.http.request(`/api/v1/upload/${uuid}/verify-password`, {
            method: "POST",
            body: JSON.stringify({ password }),
        });
    }
    async deliveryStatus(uuid, options = {}) {
        const qs = options.pollFrom
            ? `?pollFrom=${encodeURIComponent(options.pollFrom)}`
            : "";
        return this.http.request(`/api/v1/upload-sessions/${uuid}/delivery-status${qs}`, { signal: options.signal });
    }
}
exports.Sessions = Sessions;
