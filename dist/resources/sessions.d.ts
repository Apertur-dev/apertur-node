import type { HttpClient } from "../http.js";
import type { CreateSessionOptions, CreateSessionResult, Session, DeliveryStatusOptions, DeliveryStatusResponse, UpdateSessionOptions, SessionRow, SessionsListPage, QrOptions } from "../types.js";
export declare class Sessions {
    private readonly http;
    constructor(http: HttpClient);
    create(options?: CreateSessionOptions): Promise<CreateSessionResult>;
    qr(uuid: string, options?: QrOptions): Promise<Buffer>;
    get(uuid: string): Promise<Session>;
    update(uuid: string, options: UpdateSessionOptions): Promise<Session>;
    list(params?: {
        page?: number;
        pageSize?: number;
    }): Promise<SessionsListPage>;
    recent(params?: {
        limit?: number;
    }): Promise<SessionRow[]>;
    verifyPassword(uuid: string, password: string): Promise<{
        valid: boolean;
    }>;
    deliveryStatus(uuid: string, options?: DeliveryStatusOptions): Promise<DeliveryStatusResponse>;
}
