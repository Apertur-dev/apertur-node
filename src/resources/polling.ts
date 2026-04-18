import type { HttpClient } from "../http.js";
import type { PollResult, PollImage, PollProcessOptions } from "../types.js";

export class Polling {
  constructor(private readonly http: HttpClient) {}

  async list(uuid: string): Promise<PollResult> {
    return this.http.request<PollResult>(`/api/v1/upload-sessions/${uuid}/poll`);
  }

  async download(uuid: string, imageId: string): Promise<Buffer> {
    return this.http.requestBuffer(`/api/v1/upload-sessions/${uuid}/images/${imageId}`);
  }

  async ack(uuid: string, imageId: string): Promise<{ status: string }> {
    return this.http.request<{ status: string }>(`/api/v1/upload-sessions/${uuid}/images/${imageId}/ack`, {
      method: "POST",
    });
  }

  async pollAndProcess(
    uuid: string,
    handler: (image: PollImage, data: Buffer) => void | Promise<void>,
    options: PollProcessOptions = {},
  ): Promise<void> {
    const interval = options.interval ?? 3000;
    const signal = options.signal;

    while (!signal?.aborted) {
      const result = await this.list(uuid);

      for (const image of result.images) {
        if (signal?.aborted) return;
        const data = await this.download(uuid, image.id);
        await handler(image, data);
        await this.ack(uuid, image.id);
      }

      if (signal?.aborted) return;
      await new Promise<void>((resolve) => {
        const timer = setTimeout(resolve, interval);
        signal?.addEventListener("abort", () => { clearTimeout(timer); resolve(); }, { once: true });
      });
    }
  }
}
