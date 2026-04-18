import type { HttpClient } from "../http.js";
import type { EventWebhook, CreateEventWebhookConfig, UpdateEventWebhookConfig, WebhookDeliveriesResult } from "../types.js";
export declare class Webhooks {
    private readonly http;
    constructor(http: HttpClient);
    list(projectId: string): Promise<EventWebhook[]>;
    create(projectId: string, config: CreateEventWebhookConfig): Promise<EventWebhook>;
    update(projectId: string, webhookId: string, config: UpdateEventWebhookConfig): Promise<EventWebhook>;
    delete(projectId: string, webhookId: string): Promise<void>;
    test(projectId: string, webhookId: string): Promise<{
        message: string;
    }>;
    deliveries(projectId: string, webhookId: string, options?: {
        page?: number;
        limit?: number;
    }): Promise<WebhookDeliveriesResult>;
    retryDelivery(projectId: string, webhookId: string, deliveryId: string): Promise<{
        message: string;
    }>;
}
