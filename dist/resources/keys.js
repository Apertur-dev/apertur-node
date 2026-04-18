"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keys = void 0;
class Keys {
    http;
    constructor(http) {
        this.http = http;
    }
    async list(projectId) {
        return this.http.request(`/api/v1/projects/${projectId}/keys`);
    }
    async create(projectId, options) {
        return this.http.request(`/api/v1/projects/${projectId}/keys`, {
            method: "POST",
            body: JSON.stringify(options),
        });
    }
    async update(projectId, keyId, options) {
        return this.http.request(`/api/v1/projects/${projectId}/keys/${keyId}`, {
            method: "PATCH",
            body: JSON.stringify(options),
        });
    }
    async delete(projectId, keyId) {
        await this.http.request(`/api/v1/projects/${projectId}/keys/${keyId}`, { method: "DELETE" });
    }
    async setDestinations(keyId, destinationIds, longPollingEnabled) {
        return this.http.request(`/api/v1/keys/${keyId}/destinations`, {
            method: "PUT",
            body: JSON.stringify({
                destination_ids: destinationIds,
                ...(longPollingEnabled !== undefined ? { long_polling_enabled: longPollingEnabled } : {}),
            }),
        });
    }
}
exports.Keys = Keys;
