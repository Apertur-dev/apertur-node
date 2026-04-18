import { EventEmitter } from "events";

export interface AperturEventEmitter extends EventEmitter {
  on(event: "connected", listener: (data: { sessionId: string }) => void): this;
  on(event: "image:ready", listener: (data: any) => void): this;
  on(event: "image:delivering", listener: (data: any) => void): this;
  on(event: string, listener: (data: any) => void): this;
}

export class Events {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  subscribe(uuid: string): AperturEventEmitter {
    const emitter = new EventEmitter() as AperturEventEmitter;
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
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          let currentEvent = "";
          let currentData = "";

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              currentEvent = line.slice(7).trim();
            } else if (line.startsWith("data: ")) {
              currentData = line.slice(6).trim();
            } else if (line === "" && currentEvent && currentData) {
              try {
                const parsed = JSON.parse(currentData);
                emitter.emit(currentEvent, parsed);
              } catch {
                emitter.emit(currentEvent, currentData);
              }
              currentEvent = "";
              currentData = "";
            } else if (line.startsWith(": heartbeat")) {
              emitter.emit("heartbeat", {});
            }
          }
        }

        emitter.emit("close", {});
      } catch (err) {
        emitter.emit("error", err);
      }
    };

    connect();
    return emitter;
  }
}
