import type { HttpClient } from "../http.js";
import type {
  EventWebhook, CreateEventWebhookConfig, UpdateEventWebhookConfig,
  WebhookDeliveriesResult,
} from "../types.js";

export class Webhooks {
  constructor(private readonly http: HttpClient) {}

  async list(projectId: string): Promise<EventWebhook[]> {
    return this.http.request<EventWebhook[]>(`/api/v1/projects/${projectId}/webhooks`);
  }

  async create(projectId: string, config: CreateEventWebhookConfig): Promise<EventWebhook> {
    return this.http.request<EventWebhook>(`/api/v1/projects/${projectId}/webhooks`, {
      method: "POST",
      body: JSON.stringify(config),
    });
  }

  async update(projectId: string, webhookId: string, config: UpdateEventWebhookConfig): Promise<EventWebhook> {
    return this.http.request<EventWebhook>(`/api/v1/projects/${projectId}/webhooks/${webhookId}`, {
      method: "PATCH",
      body: JSON.stringify(config),
    });
  }

  async delete(projectId: string, webhookId: string): Promise<void> {
    await this.http.request<void>(`/api/v1/projects/${projectId}/webhooks/${webhookId}`, { method: "DELETE" });
  }

  async test(projectId: string, webhookId: string): Promise<{ message: string }> {
    return this.http.request<{ message: string }>(`/api/v1/projects/${projectId}/webhooks/${webhookId}/test`, {
      method: "POST",
    });
  }

  async deliveries(projectId: string, webhookId: string, options?: { page?: number; limit?: number }): Promise<WebhookDeliveriesResult> {
    const params = new URLSearchParams();
    if (options?.page) params.set("page", String(options.page));
    if (options?.limit) params.set("limit", String(options.limit));
    const qs = params.toString();
    return this.http.request<WebhookDeliveriesResult>(
      `/api/v1/projects/${projectId}/webhooks/${webhookId}/deliveries${qs ? `?${qs}` : ""}`,
    );
  }

  async retryDelivery(projectId: string, webhookId: string, deliveryId: string): Promise<{ message: string }> {
    return this.http.request<{ message: string }>(
      `/api/v1/projects/${projectId}/webhooks/${webhookId}/deliveries/${deliveryId}/retry`,
      { method: "POST" },
    );
  }
}
