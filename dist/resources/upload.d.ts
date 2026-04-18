import type { ReadStream } from "fs";
import type { HttpClient } from "../http.js";
import type { UploadResult, UploadOptions } from "../types.js";
export declare class Upload {
    private readonly http;
    constructor(http: HttpClient);
    image(uuid: string, file: Buffer | ReadStream | string, options?: UploadOptions): Promise<UploadResult>;
    imageEncrypted(uuid: string, file: Buffer | ReadStream | string, publicKey: string, options?: UploadOptions): Promise<UploadResult>;
    private toBuffer;
}
