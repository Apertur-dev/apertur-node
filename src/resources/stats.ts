import type { HttpClient } from "../http.js";
import type { Stats as StatsData } from "../types.js";

export class Stats {
  constructor(private readonly http: HttpClient) {}

  async get(): Promise<StatsData> {
    return this.http.request<StatsData>("/api/v1/stats");
  }
}
