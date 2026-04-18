import type { HttpClient } from "../http.js";
import type { PollResult, PollImage, PollProcessOptions } from "../types.js";
export declare class Polling {
    private readonly http;
    constructor(http: HttpClient);
    list(uuid: string): Promise<PollResult>;
    download(uuid: string, imageId: string): Promise<Buffer>;
    ack(uuid: string, imageId: string): Promise<{
        status: string;
    }>;
    pollAndProcess(uuid: string, handler: (image: PollImage, data: Buffer) => void | Promise<void>, options?: PollProcessOptions): Promise<void>;
}
