"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stats = void 0;
class Stats {
    http;
    constructor(http) {
        this.http = http;
    }
    async get() {
        return this.http.request("/api/v1/stats");
    }
}
exports.Stats = Stats;
