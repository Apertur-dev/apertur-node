"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polling = void 0;
class Polling {
    http;
    constructor(http) {
        this.http = http;
    }
    async list(uuid) {
        return this.http.request(`/api/v1/upload-sessions/${uuid}/poll`);
    }
    async download(uuid, imageId) {
        return this.http.requestBuffer(`/api/v1/upload-sessions/${uuid}/images/${imageId}`);
    }
    async ack(uuid, imageId) {
        return this.http.request(`/api/v1/upload-sessions/${uuid}/images/${imageId}/ack`, {
            method: "POST",
        });
    }
    async pollAndProcess(uuid, handler, options = {}) {
        const interval = options.interval ?? 3000;
        const signal = options.signal;
        while (!signal?.aborted) {
            const result = await this.list(uuid);
            for (const image of result.images) {
                if (signal?.aborted)
                    return;
                const data = await this.download(uuid, image.id);
                await handler(image, data);
                await this.ack(uuid, image.id);
            }
            if (signal?.aborted)
                return;
            await new Promise((resolve) => {
                const timer = setTimeout(resolve, interval);
                signal?.addEventListener("abort", () => { clearTimeout(timer); resolve(); }, { once: true });
            });
        }
    }
}
exports.Polling = Polling;
