# @apertur/sdk

Official Node.js SDK for the [Apertur](https://apertur.ca) API. Collect photos from any mobile device via QR codes — no app required.

## Installation

```bash
npm install @apertur/sdk
```

## Quick Start

Get up and running with a single session and image upload in just a few lines.

```javascript
const { Apertur } = require('@apertur/sdk');
// or: import { Apertur } from '@apertur/sdk';

const client = new Apertur({ apiKey: 'aptr_xxxx' });

// Create a session and upload an image
const session = await client.sessions.create({ tags: ['demo'] });
const result = await client.upload.image(session.id, './photo.jpg');
console.log(`Uploaded: ${result.filename} (${result.size_bytes} bytes)`);
```

## Authentication

Two auth methods: API key (for server-to-server) and OAuth token (for third-party integrations).

```javascript
// API Key
const client = new Apertur({ apiKey: 'aptr_your_key_here' });

// OAuth Token
const client = new Apertur({ oauthToken: 'aptr_oauth_your_token' });

// Custom base URL (for self-hosted or staging)
const client = new Apertur({ apiKey: 'aptr_xxx', baseUrl: 'https://api.aptr.ca' });
```

See [Authentication documentation](https://docs.apertur.ca/authentication)

## Sessions

Create upload sessions, check status, and manage password-protected sessions.

```javascript
// Create a session
const session = await client.sessions.create({
  tags: ['event-photos'],
  expires_in_hours: 48,
  max_images: 50,
  password: 'secret123',
  long_polling: true,
});

// Get session info
const info = await client.sessions.get(session.id);

// Verify password for protected sessions
const { valid } = await client.sessions.verifyPassword(session.id, 'secret123');

// Check delivery status
const status = await client.sessions.deliveryStatus(session.id);
```

See [Sessions documentation](https://docs.apertur.ca/upload-sessions)

## Uploading Images

Upload images as Buffer, file path, or ReadStream. Supports optional server-side encryption.

```javascript
// Upload from file path
await client.upload.image(sessionId, './photo.jpg', {
  filename: 'vacation.jpg',
  mimeType: 'image/jpeg',
  source: 'gallery',
});

// Upload from Buffer
const buffer = fs.readFileSync('./photo.png');
await client.upload.image(sessionId, buffer, { mimeType: 'image/png' });

// Upload with server-side encryption
const { publicKey } = await client.encryption.getServerKey();
await client.upload.imageEncrypted(sessionId, './photo.jpg', publicKey);
```

See [Upload documentation](https://docs.apertur.ca/upload-sessions)

## Long Polling

Retrieve uploaded images via polling instead of webhooks. Requires session created with `long_polling: true`.

```javascript
// Manual poll cycle
const { images } = await client.polling.list(sessionId);
for (const image of images) {
  const buffer = await client.polling.download(sessionId, image.id);
  fs.writeFileSync(`./downloads/${image.filename}`, buffer);
  await client.polling.ack(sessionId, image.id);
}

// Automatic poll + process loop
const controller = new AbortController();

await client.polling.pollAndProcess(sessionId, async (image, data) => {
  console.log(`Received: ${image.filename} (${image.size_bytes} bytes)`);
  fs.writeFileSync(`./output/${image.filename}`, data);
}, { interval: 3000, signal: controller.signal });

// Stop polling
controller.abort();
```

See [Long Polling documentation](https://docs.apertur.ca/long-polling)

## Receiving Webhooks

Verify webhook signatures to ensure payloads are authentic. Three verification methods match the Apertur signature schemes.

```javascript
import { verifyWebhookSignature, verifyEventSignature, verifySvixSignature } from '@apertur/sdk';

// Express middleware for image delivery webhooks
app.post('/webhook', express.raw({ type: '*/*' }), (req, res) => {
  const signature = req.headers['x-apertur-signature'];
  const isValid = verifyWebhookSignature(req.body, signature, WEBHOOK_SECRET);
  if (!isValid) return res.status(401).send('Invalid signature');
  // Process the image...
  res.status(200).send('OK');
});

// Event webhook (HMAC SHA256)
const isValid = verifyEventSignature(
  body,
  req.headers['x-apertur-timestamp'],
  req.headers['x-apertur-signature'],
  EVENT_WEBHOOK_SECRET
);

// Event webhook (Svix)
const isValid = verifySvixSignature(
  body,
  req.headers['svix-id'],
  req.headers['svix-timestamp'],
  req.headers['svix-signature'],
  EVENT_WEBHOOK_SECRET
);
```

See [Webhook documentation](https://docs.apertur.ca/webhooks)

## Destinations

Manage delivery destinations (webhook, S3, Google Drive, etc.).

```javascript
const destinations = await client.destinations.list(projectId);

const webhook = await client.destinations.create(projectId, {
  type: 'webhook',
  name: 'My Backend',
  config: { url: 'https://api.example.com/photos', format: 'json_base64' },
});

await client.destinations.test(projectId, webhook.id);
await client.destinations.update(projectId, webhook.id, { isActive: false });
await client.destinations.delete(projectId, webhook.id);
```

See [Destinations documentation](https://docs.apertur.ca/destinations)

## API Keys

Manage API keys and their default destinations.

```javascript
const keys = await client.keys.list(projectId);

const { key, plainTextKey } = await client.keys.create(projectId, {
  label: 'Production',
  maxImages: 100,
});
console.log(`Save this key: ${plainTextKey}`); // Only shown once!

// Set default destinations for a key
await client.keys.setDestinations(key.id, [dest1.id, dest2.id], true); // true = enable long polling
```

See [API Keys documentation](https://docs.apertur.ca/api-keys)

## Event Webhooks

Subscribe to project events (uploads, deliveries, billing changes, etc.).

```javascript
const webhook = await client.webhooks.create(projectId, {
  url: 'https://api.example.com/events',
  topics: ['project.upload.*', 'project.billing.plan_changed'],
});

// List deliveries
const { deliveries } = await client.webhooks.deliveries(projectId, webhook.id);

// Retry a failed delivery
await client.webhooks.retryDelivery(projectId, webhook.id, deliveries[0].id);
```

See [Event Webhooks documentation](https://docs.apertur.ca/event-webhooks)

## SSE Events

Subscribe to real-time upload events via Server-Sent Events.

```javascript
const emitter = client.events.subscribe(sessionId);

emitter.on('connected', (data) => console.log('Connected:', data.sessionId));
emitter.on('image:ready', (data) => console.log('Image ready:', data.filename));
emitter.on('image:delivered', (data) => console.log('Delivered to:', data.destinationId));
emitter.on('error', (err) => console.error('SSE error:', err));
```

See [Events documentation](https://docs.apertur.ca/sse-events)

## Error Handling

All SDK errors extend `AperturError` with typed subclasses for common HTTP failure cases.

```javascript
import { AperturError, RateLimitError, NotFoundError, AuthenticationError } from '@apertur/sdk';

try {
  await client.sessions.create();
} catch (err) {
  if (err instanceof RateLimitError) {
    console.log(`Rate limited. Retry after: ${err.retryAfter}s`);
  } else if (err instanceof AuthenticationError) {
    console.log('Invalid API key');
  } else if (err instanceof NotFoundError) {
    console.log('Resource not found');
  } else if (err instanceof AperturError) {
    console.log(`API error ${err.statusCode}: ${err.message} (code: ${err.code})`);
  }
}
```

## API Reference

For complete API documentation, visit [docs.apertur.ca](https://docs.apertur.ca).

## License

MIT
