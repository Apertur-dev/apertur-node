"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const events_1 = require("events");
class Events {
    baseUrl;
    constructor(baseUrl) {
        this.baseUrl = baseUrl.replace(/\/+$/, "");
    }
    subscribe(uuid) {
        const emitter = new events_1.EventEmitter();
        const url = `${this.baseUrl}/api/v1/upload/${uuid}/events`;
        const connect = async () => {
            try {
                const res = await fetch(url);
                if (!res.ok || !res.body) {
                    emitter.emit("error", new Error(`SSE connection failed: ${res.status}`));
                    return;
                }
                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";
                while (true) {
                    const { done, value } = await reader.read();
                    if (done)
                        break;
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() ?? "";
                    let currentEvent = "";
                    let currentData = "";
                    for (const line of lines) {
                        if (line.startsWith("event: ")) {
                            currentEvent = line.slice(7).trim();
                        }
                        else if (line.startsWith("data: ")) {
                            currentData = line.slice(6).trim();
                        }
                        else if (line === "" && currentEvent && currentData) {
                            try {
                                const parsed = JSON.parse(currentData);
                                emitter.emit(currentEvent, parsed);
                            }
                            catch {
                                emitter.emit(currentEvent, currentData);
                            }
                            currentEvent = "";
                            currentData = "";
                        }
                        else if (line.startsWith(": heartbeat")) {
                            emitter.emit("heartbeat", {});
                        }
                    }
                }
                emitter.emit("close", {});
            }
            catch (err) {
                emitter.emit("error", err);
            }
        };
        connect();
        return emitter;
    }
}
exports.Events = Events;
