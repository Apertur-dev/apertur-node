import type { HttpClient } from "../http.js";
import type { Destination, CreateDestinationConfig, UpdateDestinationConfig, TestDestinationResult } from "../types.js";
export declare class Destinations {
    private readonly http;
    constructor(http: HttpClient);
    list(projectId: string): Promise<Destination[]>;
    create(projectId: string, config: CreateDestinationConfig): Promise<Destination>;
    update(projectId: string, destId: string, config: UpdateDestinationConfig): Promise<Destination>;
    delete(projectId: string, destId: string): Promise<void>;
    test(projectId: string, destId: string): Promise<TestDestinationResult>;
}
