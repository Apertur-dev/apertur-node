import type { HttpClient } from "../http.js";
import type { ApiKey, CreateApiKeyOptions, CreateApiKeyResult, UpdateApiKeyOptions, KeyDestinations } from "../types.js";

export class Keys {
  constructor(private readonly http: HttpClient) {}

  async list(projectId: string): Promise<ApiKey[]> {
    return this.http.request<ApiKey[]>(`/api/v1/projects/${projectId}/keys`);
  }

  async create(projectId: string, options: CreateApiKeyOptions): Promise<CreateApiKeyResult> {
    return this.http.request<CreateApiKeyResult>(`/api/v1/projects/${projectId}/keys`, {
      method: "POST",
      body: JSON.stringify(options),
    });
  }

  async update(projectId: string, keyId: string, options: UpdateApiKeyOptions): Promise<ApiKey> {
    return this.http.request<ApiKey>(`/api/v1/projects/${projectId}/keys/${keyId}`, {
      method: "PATCH",
      body: JSON.stringify(options),
    });
  }

  async delete(projectId: string, keyId: string): Promise<void> {
    await this.http.request<void>(`/api/v1/projects/${projectId}/keys/${keyId}`, { method: "DELETE" });
  }

  async setDestinations(keyId: string, destinationIds: string[], longPollingEnabled?: boolean): Promise<KeyDestinations> {
    return this.http.request<KeyDestinations>(`/api/v1/keys/${keyId}/destinations`, {
      method: "PUT",
      body: JSON.stringify({
        destination_ids: destinationIds,
        ...(longPollingEnabled !== undefined ? { long_polling_enabled: longPollingEnabled } : {}),
      }),
    });
  }
}
