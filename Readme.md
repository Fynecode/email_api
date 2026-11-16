# Email API

[Live API](https://stansia-email-api.onrender.com) · [GitHub repository](https://github.com/Fynecode/email_api)

A reusable HTTP service for sending emails, built with **TypeScript, Express 5, and a layered architecture inspired by Domain-Driven Design (DDD)**.

The project separates email business rules from the HTTP layer and the external email provider. The application depends on an `EmailSender` contract, while the current infrastructure implementation uses Resend.

## Features

- **Email sending** through the Resend API.
- **Provider abstraction** through the `EmailSender` interface, allowing another provider adapter to be added without coupling the application use case to that provider.
- **API key authentication** using the `x-api-key` request header.
- **Rate limiting** on email submission routes.
- **Attachments** through multipart form uploads.
- **Request validation** with Zod.
- **Domain validation** for email addresses and email content.
- **Layered architecture** separating domain, application, infrastructure, and presentation concerns.
- **Automated tests** covering domain rules, the application use case, the Resend adapter, HTTP routes, and end-to-end request flows.

## Tech stack

| Area | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| HTTP framework | Express 5 |
| Email provider | Resend |
| Request validation | Zod |
| File uploads | Multer |
| Security headers | Helmet |
| CORS | cors |
| Rate limiting | express-rate-limit |
| Testing | Vitest, Supertest |
| Development | tsx |

## Getting started

### Prerequisites

- Node.js
- npm

You will also need a [Resend](https://resend.com) account and a verified sending domain or sender identity.

### 1. Clone the repository

```bash
git clone https://github.com/Fynecode/email_api.git
cd email_api
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000
API_KEY=replace_with_a_long_random_secret
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Port the HTTP server listens on. Defaults to `3000`. |
| `API_KEY` | Yes | Secret key clients must provide in the `x-api-key` header. |
| `RESEND_API_KEY` | Yes | API key used by the Resend SDK. |

Generate a strong API key rather than using the example value. For example:

```bash
openssl rand -hex 32
```

The Resend client is initialized from `RESEND_API_KEY`. The application will fail to initialize if that variable is missing.

### 3. Run the development server

```bash
npm run dev
```

The server listens on `http://localhost:3000` by default.

## Available scripts

```bash
npm run dev        # Start the server with tsx watch
npm run build      # Compile the TypeScript source
npm start          # Run the compiled server from dist/
npm test           # Run the test suite once
npm run test:watch # Run Vitest in watch mode
```

## API reference

### Send an email

**Method:** `POST`

**Routes:**

- `/api/email`
- `/api/email/send`
- `/api/send`

All three routes perform the same email submission operation.

**Required headers:**

```http
x-api-key: YOUR_API_KEY
Content-Type: application/json
```

For requests with attachments, use `multipart/form-data` instead of JSON and include the files under the `attachments` field.

### JSON request

```http
POST /api/email/send
x-api-key: YOUR_API_KEY
Content-Type: application/json
```

```json
{
  "from": "noreply@yourdomain.com",
  "to": "recipient@example.com",
  "subject": "Welcome",
  "body": "Hello, welcome to our service.",
  "html": "<h1>Welcome</h1><p>Thanks for joining us.</p>"
}
```

| Field | Required | Description |
|---|---|---|
| `from` | Yes | Sender email address. |
| `to` | Yes | Recipient email address. |
| `subject` | No | Email subject. Defaults to `New Email` when omitted. |
| `body` | One of body/html | Plain-text email content. |
| `html` | One of body/html | HTML email content. |

At least one of `body` or `html` must contain non-whitespace content. Both may be supplied to provide plain-text and HTML versions of the same email.

### Attachments

To send attachments, submit the request as `multipart/form-data`. Use the same fields described above and attach files using the field name `attachments`.

Current upload limits:

- Maximum of **5 files** per request.
- Maximum file size of **10 MB per file**.

The service currently uses Multer memory storage. Consider the memory implications of uploads when deploying or increasing request volume.

### Successful response

**Status:** `200 OK`

```json
{
  "success": true,
  "messageId": "re_123456789"
}
```

The `messageId` is the identifier returned by the email provider. A successful response means the provider accepted the send request; it does not independently confirm delivery to the recipient's inbox.

### Error responses

Responses use a `success` and `message` structure. Validation errors also include an `errors` property with details from Zod.

Example:

```json
{
  "success": false,
  "message": "Invalid request data.",
  "errors": {}
}
```

Common status codes include:

| Status | Meaning |
|---|---|
| `400` | Invalid request data or invalid email/domain input. |
| `401` | Missing or invalid API key. |
| `429` | Email request rate limit exceeded. |
| `500` | Unexpected server or email-sending failure. |

## Security and request handling

- Requests to the email routes must include a valid `x-api-key` header.
- The email routes are rate-limited to **50 requests per 15-minute window** using the current `express-rate-limit` configuration.
- Helmet is applied to add HTTP security headers.
- CORS middleware is enabled with its default configuration. An origin allowlist is not currently configured in the application.
- Zod validates the request body before it reaches the controller.
- Uploaded files are held in memory and limited by file count and per-file size.

For a public production deployment, configure CORS with an explicit origin policy and consider a shared rate-limit store if the service runs across multiple instances. Keep API keys and provider credentials out of source control.

## Architecture

The codebase is organized into four main layers:

```text
src/
├── domain/
│   └── email/
│       ├── entities/
│       ├── errors/
│       ├── repositories/
│       └── value-objects/
│
├── application/
│   └── email/
│       ├── dto/
│       ├── errors/
│       └── use-cases/
│
├── infrastructure/
│   └── email/
│       ├── resend/
│       └── resend-client.ts
│
├── presentation/
│   └── http/
│       ├── controllers/
│       ├── errors/
│       ├── middleware/
│       ├── routes/
│       └── validators/
│
├── app.ts
└── server.ts
```

### Layer responsibilities

**Domain**

Contains the core email model and rules, including the `Email` entity, `EmailAddress` and `Attachment` value objects, and domain errors. The `EmailSender` interface defines the contract required to send an email without tying the domain to a specific provider SDK.

**Application**

Contains the `SendEmail` use case and its request/response DTOs. It coordinates the operation using the `EmailSender` abstraction.

**Infrastructure**

Contains external-service integrations. The current `ResendEmailSender` implements `EmailSender` and translates the domain email into a Resend API request.

**Presentation**

Contains the Express HTTP layer: routes, controller, request validation, API key middleware, rate limiting, upload handling, and HTTP error handling.

### Dependency direction

The application use case depends on the `EmailSender` contract rather than on Resend directly. The concrete Resend adapter is supplied when the application is created:

```typescript
const emailSender = new ResendEmailSender();
const app = createApp(emailSender);
```

This keeps provider-specific code outside the application use case and makes it possible to substitute a test double when testing the application and HTTP layers.

## Testing

The project uses Vitest and Supertest.

The test suite is organized by testing scope:

```text
tests/
├── unit/
│   ├── domain/
│   └── application/
├── integration/
│   ├── infrastructure/
│   └── presentation/
└── e2e/
```

Run the full suite with:

```bash
npm test
```

The tests cover domain validation, use-case behavior, the Resend adapter, HTTP request handling, authentication, attachments, and end-to-end email submission flows. External email-provider behavior is mocked in tests, so running the test suite does not require sending real emails.

## Deployment

The service can be deployed to a Node.js hosting platform that supports running a long-lived Express server.

Typical build and start commands:

```bash
npm run build
npm start
```

Configure the following environment variables in the hosting platform:

- `PORT` (if required by the platform)
- `API_KEY`
- `RESEND_API_KEY`

Do not expose either secret in client-side code or commit them to the repository.

## Current scope and future work

The current implementation sends email synchronously through Resend. It does not yet include a second provider implementation, automatic provider failover, a persistent queue, retry scheduling, delivery-status tracking, or a database-backed email history.

Potential next steps:

- [ ] Add a second provider adapter.
- [ ] Add structured logging and request correlation.
- [ ] Improve attachment validation, including file-type and aggregate-size limits.
- [ ] Add provider-aware retry handling and idempotency protections.
- [ ] Add a persistent queue for asynchronous email processing.
- [ ] Add delivery and bounce tracking through provider webhooks.
- [ ] Add per-client API keys, quotas, and key rotation.
- [ ] Add API documentation with an OpenAPI specification.
- [ ] Add CI checks and performance/load testing.

## License

The package metadata currently declares the project license as ISC. See the repository for the applicable license terms.

---

Built with TypeScript, Express, and Resend.
