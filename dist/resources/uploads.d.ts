import type { HttpClient } from "../http.js";
import type { UploadRow, UploadsListPage } from "../types.js";
export declare class Uploads {
    private readonly http;
    constructor(http: HttpClient);
    list(params?: {
        page?: number;
        pageSize?: number;
    }): Promise<UploadsListPage>;
    recent(params?: {
        limit?: number;
    }): Promise<UploadRow[]>;
}
