export interface HttpOptions {
    method?: string;
    body?: string | Buffer | FormData;
    headers?: Record<string, string>;
    rawResponse?: boolean;
    signal?: AbortSignal;
}
export declare class HttpClient {
    private readonly baseUrl;
    private readonly authHeader;
    constructor(baseUrl: string, auth: {
        apiKey?: string;
        oauthToken?: string;
    });
    request<T>(path: string, options?: HttpOptions): Promise<T>;
    requestBuffer(path: string, options?: HttpOptions): Promise<Buffer>;
    private handleError;
}
