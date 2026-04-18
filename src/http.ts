import { AperturError, RateLimitError, NotFoundError, AuthenticationError, ValidationError } from "./errors.js";

export interface HttpOptions {
  method?: string;
  body?: string | Buffer | FormData;
  headers?: Record<string, string>;
  rawResponse?: boolean;
  signal?: AbortSignal;
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly authHeader: string;

  constructor(baseUrl: string, auth: { apiKey?: string; oauthToken?: string }) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");

    if (auth.apiKey) {
      this.authHeader = `Bearer ${auth.apiKey}`;
    } else if (auth.oauthToken) {
      this.authHeader = `Bearer ${auth.oauthToken}`;
    } else {
      this.authHeader = "";
    }
  }

  async request<T>(path: string, options: HttpOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {}, rawResponse = false, signal } = options;

    const reqHeaders: Record<string, string> = { ...headers };
    if (this.authHeader) {
      reqHeaders["Authorization"] = this.authHeader;
    }
    if (typeof body === "string") {
      reqHeaders["Content-Type"] = reqHeaders["Content-Type"] ?? "application/json";
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: reqHeaders,
      body: body as any,
      signal,
    });

    if (!res.ok) {
      await this.handleError(res);
    }

    if (rawResponse) {
      return res as unknown as T;
    }

    if (res.status === 204) {
      return undefined as T;
    }

    return res.json() as Promise<T>;
  }

  async requestBuffer(path: string, options: HttpOptions = {}): Promise<Buffer> {
    const { method = "GET", headers = {} } = options;

    const reqHeaders: Record<string, string> = { ...headers };
    if (this.authHeader) {
      reqHeaders["Authorization"] = this.authHeader;
    }

    const res = await fetch(`${this.baseUrl}${path}`, { method, headers: reqHeaders });

    if (!res.ok) {
      await this.handleError(res);
    }

    const arrayBuf = await res.arrayBuffer();
    return Buffer.from(arrayBuf);
  }

  private async handleError(res: Response): Promise<never> {
    let body: any = {};
    try {
      body = await res.json();
    } catch {
      body = { message: `HTTP ${res.status}` };
    }

    const message = body.message || `HTTP ${res.status}`;
    const code = body.code;

    switch (res.status) {
      case 401:
        throw new AuthenticationError(message);
      case 404:
        throw new NotFoundError(message);
      case 429: {
        const retryAfter = parseInt(res.headers.get("Retry-After") ?? "", 10) || undefined;
        throw new RateLimitError(message, retryAfter);
      }
      case 400:
        throw new ValidationError(message);
      default:
        throw new AperturError(res.status, message, code);
    }
  }
}
