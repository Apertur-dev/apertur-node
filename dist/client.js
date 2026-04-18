"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Apertur = void 0;
const http_js_1 = require("./http.js");
const sessions_js_1 = require("./resources/sessions.js");
const upload_js_1 = require("./resources/upload.js");
const polling_js_1 = require("./resources/polling.js");
const events_js_1 = require("./resources/events.js");
const destinations_js_1 = require("./resources/destinations.js");
const keys_js_1 = require("./resources/keys.js");
const webhooks_js_1 = require("./resources/webhooks.js");
const encryption_js_1 = require("./resources/encryption.js");
const uploads_js_1 = require("./resources/uploads.js");
const stats_js_1 = require("./resources/stats.js");
const DEFAULT_BASE_URL = "https://api.aptr.ca";
const SANDBOX_BASE_URL = "https://sandbox.api.aptr.ca";
class Apertur {
    http;
    /** The environment this client targets (live or test), inferred from the API key prefix. */
    env;
    sessions;
    upload;
    polling;
    events;
    destinations;
    keys;
    webhooks;
    encryption;
    uploads;
    stats;
    constructor(config) {
        if (!config.apiKey && !config.oauthToken) {
            throw new Error("Either apiKey or oauthToken must be provided");
        }
        // Resolve env from key prefix or explicit config
        const token = config.apiKey ?? config.oauthToken ?? "";
        const detectedEnv = token.startsWith("aptr_test_") ? "test" : "live";
        this.env = config.env ?? detectedEnv;
        // Auto-select sandbox URL for test keys unless baseUrl is explicitly set
        const baseUrl = config.baseUrl ?? (this.env === "test" ? SANDBOX_BASE_URL : DEFAULT_BASE_URL);
        this.http = new http_js_1.HttpClient(baseUrl, { apiKey: config.apiKey, oauthToken: config.oauthToken });
        this.sessions = new sessions_js_1.Sessions(this.http);
        this.upload = new upload_js_1.Upload(this.http);
        this.polling = new polling_js_1.Polling(this.http);
        this.events = new events_js_1.Events(baseUrl);
        this.destinations = new destinations_js_1.Destinations(this.http);
        this.keys = new keys_js_1.Keys(this.http);
        this.webhooks = new webhooks_js_1.Webhooks(this.http);
        this.encryption = new encryption_js_1.Encryption(this.http);
        this.uploads = new uploads_js_1.Uploads(this.http);
        this.stats = new stats_js_1.Stats(this.http);
    }
}
exports.Apertur = Apertur;
