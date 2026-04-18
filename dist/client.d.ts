import type { AperturConfig } from "./types.js";
import { Sessions } from "./resources/sessions.js";
import { Upload } from "./resources/upload.js";
import { Polling } from "./resources/polling.js";
import { Events } from "./resources/events.js";
import { Destinations } from "./resources/destinations.js";
import { Keys } from "./resources/keys.js";
import { Webhooks } from "./resources/webhooks.js";
import { Encryption } from "./resources/encryption.js";
import { Uploads } from "./resources/uploads.js";
import { Stats } from "./resources/stats.js";
export declare class Apertur {
    private readonly http;
    /** The environment this client targets (live or test), inferred from the API key prefix. */
    readonly env: "live" | "test";
    readonly sessions: Sessions;
    readonly upload: Upload;
    readonly polling: Polling;
    readonly events: Events;
    readonly destinations: Destinations;
    readonly keys: Keys;
    readonly webhooks: Webhooks;
    readonly encryption: Encryption;
    readonly uploads: Uploads;
    readonly stats: Stats;
    constructor(config: AperturConfig);
}
