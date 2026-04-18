import type { HttpClient } from "../http.js";
import type { ServerKey } from "../types.js";
export declare class Encryption {
    private readonly http;
    constructor(http: HttpClient);
    getServerKey(): Promise<ServerKey>;
}
