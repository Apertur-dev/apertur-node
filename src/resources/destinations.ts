import type { HttpClient } from "../http.js";
import type { Destination, CreateDestinationConfig, UpdateDestinationConfig, TestDestinationResult } from "../types.js";

export class Destinations {
  constructor(private readonly http: HttpClient) {}

  async list(projectId: string): Promise<Destination[]> {
    return this.http.request<Destination[]>(`/api/v1/projects/${projectId}/destinations`);
  }

  async create(projectId: string, config: CreateDestinationConfig): Promise<Destination> {
    return this.http.request<Destination>(`/api/v1/projects/${projectId}/destinations`, {
      method: "POST",
      body: JSON.stringify(config),
    });
  }

  async update(projectId: string, destId: string, config: UpdateDestinationConfig): Promise<Destination> {
    return this.http.request<Destination>(`/api/v1/projects/${projectId}/destinations/${destId}`, {
      method: "PATCH",
      body: JSON.stringify(config),
    });
  }

  async delete(projectId: string, destId: string): Promise<void> {
    await this.http.request<void>(`/api/v1/projects/${projectId}/destinations/${destId}`, { method: "DELETE" });
  }

  async test(projectId: string, destId: string): Promise<TestDestinationResult> {
    return this.http.request<TestDestinationResult>(`/api/v1/projects/${projectId}/destinations/${destId}/test`, {
      method: "POST",
    });
  }
}
