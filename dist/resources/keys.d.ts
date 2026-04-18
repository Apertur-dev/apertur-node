import type { HttpClient } from "../http.js";
import type { ApiKey, CreateApiKeyOptions, CreateApiKeyResult, UpdateApiKeyOptions, KeyDestinations } from "../types.js";
export declare class Keys {
    private readonly http;
    constructor(http: HttpClient);
    list(projectId: string): Promise<ApiKey[]>;
    create(projectId: string, options: CreateApiKeyOptions): Promise<CreateApiKeyResult>;
    update(projectId: string, keyId: string, options: UpdateApiKeyOptions): Promise<ApiKey>;
    delete(projectId: string, keyId: string): Promise<void>;
    setDestinations(keyId: string, destinationIds: string[], longPollingEnabled?: boolean): Promise<KeyDestinations>;
}
