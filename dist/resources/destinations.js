"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Destinations = void 0;
class Destinations {
    http;
    constructor(http) {
        this.http = http;
    }
    async list(projectId) {
        return this.http.request(`/api/v1/projects/${projectId}/destinations`);
    }
    async create(projectId, config) {
        return this.http.request(`/api/v1/projects/${projectId}/destinations`, {
            method: "POST",
            body: JSON.stringify(config),
        });
    }
    async update(projectId, destId, config) {
        return this.http.request(`/api/v1/projects/${projectId}/destinations/${destId}`, {
            method: "PATCH",
            body: JSON.stringify(config),
        });
    }
    async delete(projectId, destId) {
        await this.http.request(`/api/v1/projects/${projectId}/destinations/${destId}`, { method: "DELETE" });
    }
    async test(projectId, destId) {
        return this.http.request(`/api/v1/projects/${projectId}/destinations/${destId}/test`, {
            method: "POST",
        });
    }
}
exports.Destinations = Destinations;
