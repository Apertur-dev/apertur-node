export interface AperturConfig {
    apiKey?: string;
    oauthToken?: string;
    baseUrl?: string;
    /** Override the auto-detected environment. By default, inferred from the API key prefix. */
    env?: "live" | "test";
}
export interface CreateSessionOptions {
    destination_ids?: string[];
    long_polling?: boolean;
    tags?: string[];
    expires_in_hours?: number;
    expires_at?: string;
    max_images?: number;
    allowed_mime_types?: Array<"image/jpeg" | "image/png" | "image/webp" | "image/heic">;
    max_image_dimension?: number;
    password?: string;
}
export interface Session {
    id: string;
    status: "pending" | "active" | "completed" | "expired";
    expiresAt: string;
    tags?: string[] | null;
    imagesPerSession?: number;
    effectiveMaxImages?: number;
    effectiveAllowedMimeTypes?: string[];
    effectiveMaxImageDimension?: number | null;
    password_protected?: boolean;
    serverPublicKey?: string;
    e2eEnabled?: boolean;
    e2ePublicKey?: string | null;
    e2eDowngraded?: boolean;
}
export interface QrSpecs {
    endpoint: string;
    formats: string[];
    params: Record<string, string>;
}
export interface CreateSessionResult {
    uuid: string;
    upload_url: string;
    qr_url: string;
    qr_specs: QrSpecs;
    destinations: Array<{
        id: string;
        type: string;
        name: string;
    }>;
    long_polling: boolean;
    expires_at: string;
    password_protected: boolean;
    env: "live" | "test";
}
export interface QrOptions {
    format?: "png" | "svg" | "jpeg";
    size?: number;
    style?: "square" | "rounded";
    fg?: string;
    bg?: string;
    borderSize?: number;
    borderColor?: string;
}
export interface UpdateSessionOptions {
    expires_at?: string;
    max_images?: number;
    allowed_mime_types?: Array<"image/jpeg" | "image/png" | "image/webp" | "image/heic">;
    max_image_dimension?: number;
    max_image_size_mb?: number;
    password?: string | null;
}
export interface SessionRow {
    id: string;
    createdAt: string;
    expiresAt: string;
    status: string;
    projectId: string;
    projectName: string;
    imagesCount: number;
    imagesDelivered: number;
    imagesFailed: number;
    destinationsCount: number;
    tags: string[] | null;
    longPollingEnabled: boolean;
    label: string | null;
    env: "live" | "test";
}
export interface SessionsListPage {
    data: SessionRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
export interface UploadResult {
    id: string;
    filename: string;
    size_bytes: number;
    destinations: number;
    long_polling: boolean;
}
export interface UploadOptions {
    filename?: string;
    mimeType?: string;
    source?: string;
    password?: string;
}
export interface PollImage {
    id: string;
    filename: string;
    size_bytes: number;
    mime_type: string;
    source: string;
    created_at: string;
}
export interface PollResult {
    images: PollImage[];
}
export interface PollProcessOptions {
    interval?: number;
    signal?: AbortSignal;
}
export interface DeliveryDestinationStatus {
    destination_id: string;
    type: string;
    name: string;
    status: "pending" | "sending" | "sent" | "failed" | "retrying";
    attempts: number;
    last_error: string | null;
}
export interface DeliveryRecordStatus {
    record_id: string;
    filename: string;
    size_bytes: number;
    has_thumbnail?: boolean;
    destinations: DeliveryDestinationStatus[];
}
export interface DeliveryStatusResponse {
    status: "pending" | "active" | "completed" | "expired";
    files: DeliveryRecordStatus[];
    /** ISO 8601 timestamp of the most recent change. Pass back via `pollFrom`
     *  on the next call to long-poll until something changes. */
    lastChanged: string;
}
export interface DeliveryStatusOptions {
    /** ISO 8601 timestamp from a prior response's `lastChanged`. The server
     *  will hold the request up to ~5 minutes if nothing has changed since. */
    pollFrom?: string;
    /** Optional AbortSignal — useful for cancelling a long-poll on shutdown. */
    signal?: AbortSignal;
}
export interface Destination {
    id: string;
    type: string;
    name: string;
    config: Record<string, unknown>;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface CreateDestinationConfig {
    type: string;
    name: string;
    config: Record<string, unknown>;
}
export interface UpdateDestinationConfig {
    name?: string;
    config?: Record<string, unknown>;
    isActive?: boolean;
}
export interface TestDestinationResult {
    success: boolean;
    status?: number;
    error?: string;
    message?: string;
}
export interface ApiKey {
    id: string;
    prefix: string;
    label: string;
    env: "live" | "test";
    isActive: boolean;
    lastUsedAt: string | null;
    maxImages: number | null;
    allowedMimeTypes: string[];
    maxImageDimension: number | null;
    longPollingEnabled: boolean;
    defaultDestinations: string[];
    allowedIps: string[];
    allowedDomains: string[];
    totpEnabled: boolean;
    clientCertEnabled: boolean;
    clientCertFingerprint: string | null;
    createdAt: string;
}
export interface CreateApiKeyOptions {
    label: string;
    maxImages?: number | null;
    allowedMimeTypes?: string[];
    maxImageDimension?: number | null;
}
export interface CreateApiKeyResult {
    key: ApiKey;
    plainTextKey: string;
}
export interface UpdateApiKeyOptions {
    label?: string;
    isActive?: boolean;
    maxImages?: number;
    allowedMimeTypes?: string[];
    maxImageDimension?: number;
    allowedIps?: string[];
    allowedDomains?: string[];
}
export interface KeyDestinations {
    destinations: Array<{
        id: string;
        type: string;
        name: string;
        isActive: boolean;
    }>;
    longPollingEnabled: boolean;
}
export interface EventWebhook {
    id: string;
    projectId: string;
    url: string;
    secret: string;
    signatureMethod: "hmac_sha256" | "svix";
    topics: string[];
    isActive: boolean;
    maxRetries: number;
    retryIntervals: number[];
    disableAfterFailures: number;
    consecutiveFailures: number;
    customHeaders: Record<string, string>;
    disabledAt: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface CreateEventWebhookConfig {
    url: string;
    topics: string[];
    signatureMethod?: "hmac_sha256" | "svix";
    maxRetries?: number;
    retryIntervals?: number[];
    disableAfterFailures?: number;
    customHeaders?: Record<string, string>;
}
export interface UpdateEventWebhookConfig {
    url?: string;
    topics?: string[];
    isActive?: boolean;
    maxRetries?: number;
    retryIntervals?: number[];
    disableAfterFailures?: number;
    customHeaders?: Record<string, string>;
}
export interface WebhookDelivery {
    id: string;
    eventLogId: string;
    topic: string;
    status: "sent" | "failed" | "retrying";
    attempts: number;
    responseCode: number | null;
    responseBody: string | null;
    durationMs: number;
    lastError: string | null;
    nextRetryAt: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface WebhookDeliveriesResult {
    deliveries: WebhookDelivery[];
    total: number;
    page: number;
    limit: number;
}
export interface ServerKey {
    publicKey: string;
}
export interface UploadDestinationBreakdown {
    type: string;
    count: number;
}
export interface UploadRow {
    id: string;
    filename: string;
    sizeBytes: number;
    mimeType: string;
    source: string;
    isEncrypted: boolean;
    env: "live" | "test";
    createdAt: string;
    sessionId: string;
    projectId: string;
    projectName: string;
    destinationsTotal: number;
    destinationsDelivered: number;
    destinationsFailed: number;
    destinationsBreakdown: UploadDestinationBreakdown[];
    status: "delivered" | "failed" | "partial" | "pending" | "stored_only";
}
export interface UploadsListPage {
    data: UploadRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
export interface StatsTopProject {
    id: string;
    name: string;
    sessions: number;
}
export interface Stats {
    sessionsThisMonth: number;
    sessionsTotal: number;
    imagesUploaded: number;
    imagesDelivered: number;
    deliverySuccessRate: number;
    totalProjects: number;
    activeKeys: number;
    topProjects: StatsTopProject[];
}
