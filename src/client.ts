import type { AperturConfig } from "./types.js";
import { HttpClient } from "./http.js";
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

const DEFAULT_BASE_URL = "https://api.aptr.ca";
const SANDBOX_BASE_URL = "https://sandbox.api.aptr.ca";

export class Apertur {
  private readonly http: HttpClient;
  /** The environment this client targets (live or test), inferred from the API key prefix. */
  public readonly env: "live" | "test";

  public readonly sessions: Sessions;
  public readonly upload: Upload;
  public readonly polling: Polling;
  public readonly events: Events;
  public readonly destinations: Destinations;
  public readonly keys: Keys;
  public readonly webhooks: Webhooks;
  public readonly encryption: Encryption;
  public readonly uploads: Uploads;
  public readonly stats: Stats;

  constructor(config: AperturConfig) {
    if (!config.apiKey && !config.oauthToken) {
      throw new Error("Either apiKey or oauthToken must be provided");
    }

    // Resolve env from key prefix or explicit config
    const token = config.apiKey ?? config.oauthToken ?? "";
    const detectedEnv = token.startsWith("aptr_test_") ? "test" : "live";
    this.env = config.env ?? detectedEnv;

    // Auto-select sandbox URL for test keys unless baseUrl is explicitly set
    const baseUrl = config.baseUrl ?? (this.env === "test" ? SANDBOX_BASE_URL : DEFAULT_BASE_URL);
    this.http = new HttpClient(baseUrl, { apiKey: config.apiKey, oauthToken: config.oauthToken });

    this.sessions = new Sessions(this.http);
    this.upload = new Upload(this.http);
    this.polling = new Polling(this.http);
    this.events = new Events(baseUrl);
    this.destinations = new Destinations(this.http);
    this.keys = new Keys(this.http);
    this.webhooks = new Webhooks(this.http);
    this.encryption = new Encryption(this.http);
    this.uploads = new Uploads(this.http);
    this.stats = new Stats(this.http);
  }
}
