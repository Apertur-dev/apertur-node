"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uploads = void 0;
class Uploads {
    http;
    constructor(http) {
        this.http = http;
    }
    async list(params = {}) {
        const qs = new URLSearchParams();
        if (params.page !== undefined)
            qs.set("page", String(params.page));
        if (params.pageSize !== undefined)
            qs.set("pageSize", String(params.pageSize));
        const suffix = qs.toString() ? `?${qs.toString()}` : "";
        return this.http.request(`/api/v1/uploads${suffix}`);
    }
    async recent(params = {}) {
        const qs = new URLSearchParams();
        if (params.limit !== undefined)
            qs.set("limit", String(params.limit));
        const suffix = qs.toString() ? `?${qs.toString()}` : "";
        return this.http.request(`/api/v1/uploads/recent${suffix}`);
    }
}
exports.Uploads = Uploads;
