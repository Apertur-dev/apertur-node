"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Webhooks = void 0;
class Webhooks {
    http;
    constructor(http) {
        this.http = http;
    }
    async list(projectId) {
        return this.http.request(`/api/v1/projects/${projectId}/webhooks`);
    }
    async create(projectId, config) {
        return this.http.request(`/api/v1/projects/${projectId}/webhooks`, {
            method: "POST",
            body: JSON.stringify(config),
        });
    }
    async update(projectId, webhookId, config) {
        return this.http.request(`/api/v1/projects/${projectId}/webhooks/${webhookId}`, {
            method: "PATCH",
            body: JSON.stringify(config),
        });
    }
    async delete(projectId, webhookId) {
        await this.http.request(`/api/v1/projects/${projectId}/webhooks/${webhookId}`, { method: "DELETE" });
    }
    async test(projectId, webhookId) {
        return this.http.request(`/api/v1/projects/${projectId}/webhooks/${webhookId}/test`, {
            method: "POST",
        });
    }
    async deliveries(projectId, webhookId, options) {
        const params = new URLSearchParams();
        if (options?.page)
            params.set("page", String(options.page));
        if (options?.limit)
            params.set("limit", String(options.limit));
        const qs = params.toString();
        return this.http.request(`/api/v1/projects/${projectId}/webhooks/${webhookId}/deliveries${qs ? `?${qs}` : ""}`);
    }
    async retryDelivery(projectId, webhookId, deliveryId) {
        return this.http.request(`/api/v1/projects/${projectId}/webhooks/${webhookId}/deliveries/${deliveryId}/retry`, { method: "POST" });
    }
}
exports.Webhooks = Webhooks;
