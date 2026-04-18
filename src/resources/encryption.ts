import type { HttpClient } from "../http.js";
import type { ServerKey } from "../types.js";

export class Encryption {
  constructor(private readonly http: HttpClient) {}

  async getServerKey(): Promise<ServerKey> {
    return this.http.request<ServerKey>("/api/v1/encryption/server-key");
  }
}
