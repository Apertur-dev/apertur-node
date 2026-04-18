import type { HttpClient } from "../http.js";
import type { Stats as StatsData } from "../types.js";
export declare class Stats {
    private readonly http;
    constructor(http: HttpClient);
    get(): Promise<StatsData>;
}
