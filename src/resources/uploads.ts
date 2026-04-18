import type { HttpClient } from "../http.js";
import type { UploadRow, UploadsListPage } from "../types.js";

export class Uploads {
  constructor(private readonly http: HttpClient) {}

  async list(params: { page?: number; pageSize?: number } = {}): Promise<UploadsListPage> {
    const qs = new URLSearchParams();
    if (params.page !== undefined) qs.set("page", String(params.page));
    if (params.pageSize !== undefined) qs.set("pageSize", String(params.pageSize));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return this.http.request<UploadsListPage>(`/api/v1/uploads${suffix}`);
  }

  async recent(params: { limit?: number } = {}): Promise<UploadRow[]> {
    const qs = new URLSearchParams();
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return this.http.request<UploadRow[]>(`/api/v1/uploads/recent${suffix}`);
  }
}
