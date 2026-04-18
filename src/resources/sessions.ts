import type { HttpClient } from "../http.js";
import type {
  CreateSessionOptions,
  CreateSessionResult,
  Session,
  DeliveryStatusOptions,
  DeliveryStatusResponse,
  UpdateSessionOptions,
  SessionRow,
  SessionsListPage,
  QrOptions,
} from "../types.js";

export class Sessions {
  constructor(private readonly http: HttpClient) {}

  async create(options: CreateSessionOptions = {}): Promise<CreateSessionResult> {
    return this.http.request<CreateSessionResult>("/api/v1/upload-sessions", {
      method: "POST",
      body: JSON.stringify(options),
    });
  }

  async qr(uuid: string, options: QrOptions = {}): Promise<Buffer> {
    const params = new URLSearchParams();
    if (options.format) params.set("format", options.format);
    if (options.size) params.set("size", String(options.size));
    if (options.style) params.set("style", options.style);
    if (options.fg) params.set("fg", options.fg);
    if (options.bg) params.set("bg", options.bg);
    if (options.borderSize) params.set("borderSize", String(options.borderSize));
    if (options.borderColor) params.set("borderColor", options.borderColor);
    const qs = params.toString();
    return this.http.requestBuffer(`/api/v1/upload-sessions/${uuid}/qr${qs ? `?${qs}` : ""}`);
  }

  async get(uuid: string): Promise<Session> {
    return this.http.request<Session>(`/api/v1/upload/${uuid}/session`);
  }

  async update(uuid: string, options: UpdateSessionOptions): Promise<Session> {
    return this.http.request<Session>(`/api/v1/upload-sessions/${uuid}`, {
      method: "PATCH",
      body: JSON.stringify(options),
    });
  }

  async list(params: { page?: number; pageSize?: number } = {}): Promise<SessionsListPage> {
    const qs = new URLSearchParams();
    if (params.page !== undefined) qs.set("page", String(params.page));
    if (params.pageSize !== undefined) qs.set("pageSize", String(params.pageSize));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return this.http.request<SessionsListPage>(`/api/v1/sessions${suffix}`);
  }

  async recent(params: { limit?: number } = {}): Promise<SessionRow[]> {
    const qs = new URLSearchParams();
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return this.http.request<SessionRow[]>(`/api/v1/sessions/recent${suffix}`);
  }

  async verifyPassword(uuid: string, password: string): Promise<{ valid: boolean }> {
    return this.http.request<{ valid: boolean }>(`/api/v1/upload/${uuid}/verify-password`, {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  }

  async deliveryStatus(
    uuid: string,
    options: DeliveryStatusOptions = {},
  ): Promise<DeliveryStatusResponse> {
    const qs = options.pollFrom
      ? `?pollFrom=${encodeURIComponent(options.pollFrom)}`
      : "";
    return this.http.request<DeliveryStatusResponse>(
      `/api/v1/upload-sessions/${uuid}/delivery-status${qs}`,
      { signal: options.signal },
    );
  }
}
