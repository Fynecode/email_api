# Email API

A production-ready, type-safe email service built with **TypeScript, Express, and Domain-Driven Design (DDD)**. Supports multiple email providers with a clean, extensible architecture.

## 🎯 Project Overview

**Email API** is a reusable microservice for sending emails reliably. It demonstrates backend development best practices including clean architecture, API key authentication, rate limiting, and provider abstraction—making it easy to switch email providers.

Perfect for junior developers learning backend development, microservice patterns, and enterprise-grade code organization.

### Key Features

- ✅ **Multiple Email Providers** - Pluggable provider architecture (Resend, SendGrid, etc.)
- 🔑 **API Key Authentication** - Secure request validation
- 🚦 **Rate Limiting** - Prevent abuse with intelligent throttling
- 📨 **Email Attachments** - Support for file uploads and attachments
- ✔️ **Request Validation** - Zod-powered schema validation
- 🏗️ **DDD Architecture** - Clean separation of concerns
- 🛡️ **Security** - Helmet for HTTP headers, CORS protection
- 📝 **Type-Safe** - Full TypeScript coverage
- 🚀 **Production Ready** - Error handling, logging, monitoring-ready

## 🛠️ Tech Stack

### Runtime & Framework
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe development

### Email & Communication
- **Resend** - Modern email API (primary provider)
- **SendGrid** - Alternative email provider support
- **Multer** - File upload handling

### Validation & Security
- **Zod** - Schema validation & parsing
- **Helmet** - HTTP security headers
- **CORS** - Cross-origin request control
- **express-rate-limit** - Rate limiting middleware

### Development
- **tsx** - TypeScript execution for development
- **Node.js types** - Complete TypeScript definitions

## 📦 Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **pnpm**
- **Resend Account** (free tier available at [resend.com](https://resend.com))
- Basic understanding of REST APIs and TypeScript

## 🚀 Getting Started

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/Fynecode/email_api.git
cd email_api

# Install dependencies
npm install
# or
pnpm install
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Email Provider
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# API Security
API_KEY=your_secure_api_key_here

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://yourdomain.com

# Optional: SendGrid alternative
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Getting API Keys:**
- **Resend**: Sign up at [resend.com](https://resend.com) → API Keys section
- **SendGrid**: Sign up at [sendgrid.com](https://sendgrid.com) → API Keys
- **API_KEY**: Generate a random secure key (use `openssl rand -hex 32`)

### 3. Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

## 📚 Available Commands

```bash
# Development
npm run dev          # Start dev server with auto-reload (tsx watch)

# Production
npm run build        # Compile TypeScript to JavaScript
npm start            # Run compiled JavaScript

# Both commands
npm run build && npm start
```

## 📁 Project Structure

```
src/
├── domain/                           # Business rules & entities
│   ├── entities/
│   │   └── Email.ts                 # Email entity definition
│   ├── repositories/
│   │   └── IEmailRepository.ts      # Email service interface
│   ├── value-objects/
│   │   └── EmailAddress.ts          # Email value object
│   └── errors/
│       └── DomainError.ts           # Domain-specific errors
│
├── application/                      # Use cases & application logic
│   ├── use-cases/
│   │   └── SendEmailUseCase.ts      # Core business logic
│   ├── dtos/
│   │   └── SendEmailDTO.ts          # Data transfer objects
│   └── errors/
│       └── ApplicationError.ts      # Application errors
│
├── presentation/                     # HTTP layer
│   ├── controllers/
│   │   └── EmailController.ts       # Request handlers
│   ├── routes/
│   │   └── emailRoutes.ts           # API routes
│   └── middleware/
│       ├── auth.ts                  # API key validation
│       └── errorHandler.ts          # Error handling
│
├── infrastructure/                   # External services
│   ├── providers/
│   │   ├── ResendProvider.ts        # Resend integration
│   │   └── SendGridProvider.ts      # SendGrid integration
│   └── repositories/
│       └── EmailRepository.ts       # Email repository impl
│
└── server.ts                         # Application entry point
```

## 🏗️ Architecture: Domain-Driven Design

This project follows **DDD** with layered architecture:

```
Presentation Layer (Controllers/Routes/Middleware)
       ↓
Application Layer (Use Cases/DTOs)
       ↓
Domain Layer (Entities/Value Objects/Interfaces)
       ↓
Infrastructure Layer (Email Providers/Databases)
```

### Key Concepts

**Domain Layer**
- Defines core business rules (what is an email?)
- Interfaces (IEmailRepository) - contracts for implementations
- Value Objects (EmailAddress) - immutable objects with behavior

**Application Layer**
- Use Cases (SendEmailUseCase) - orchestrate business logic
- DTOs (SendEmailDTO) - standardize data between layers
- Application Errors - specific to use cases

**Presentation Layer**
- Controllers - handle HTTP requests
- Routes - define API endpoints
- Middleware - cross-cutting concerns (auth, error handling)

**Infrastructure Layer**
- Email Providers - actual implementation (Resend, SendGrid)
- Repositories - implement domain interfaces

### Why This Architecture?

✨ **Testable** - Each layer can be tested independently  
✨ **Maintainable** - Clear separation of concerns  
✨ **Scalable** - Easy to add new features or providers  
✨ **Professional** - Enterprise-grade code organization  

## 🔌 API Endpoints

### Send Email

**POST** `/api/email/send`

**Headers:**
```
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "from": "noreply@yourdomain.com",
  "subject": "Welcome!",
  "html": "<h1>Hello</h1><p>This is an email.</p>",
  "text": "Hello, this is an email.",
  "cc": ["cc@example.com"],
  "bcc": ["bcc@example.com"],
  "replyTo": "support@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "messageId": "re_123456789",
  "timestamp": "2025-08-07T12:00:00Z"
}
```

**Error Response (400/401/429/500):**
```json
{
  "error": "Invalid email address",
  "statusCode": 400
}
```

### Health Check

**GET** `/api/health`

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "uptime": 3600
}
```

## 🔐 Security Features

- **API Key Authentication** - Validates every request
- **Rate Limiting** - Prevents abuse (configurable window)
- **CORS** - Whitelist allowed origins
- **Helmet** - Secure HTTP headers (XSS, CSRF protection)
- **Input Validation** - Zod schemas for all inputs
- **Error Messages** - No sensitive info in responses
- **Environment Variables** - Never hardcode secrets

## 🧪 Testing

Add tests using your preferred framework (Jest, Vitest):

```bash
# Create test file
src/application/use-cases/__tests__/SendEmailUseCase.test.ts

# Run tests
npm run test
```

Example test:
```typescript
import { SendEmailUseCase } from '../SendEmailUseCase';
import { MockEmailRepository } from './mocks/MockEmailRepository';

describe('SendEmailUseCase', () => {
  it('should send email successfully', async () => {
    const repository = new MockEmailRepository();
    const useCase = new SendEmailUseCase(repository);
    
    const result = await useCase.execute({
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Test</p>'
    });
    
    expect(result.success).toBe(true);
  });
});
```

## 🚀 Deployment

### Deploy to Vercel

```bash
npm run build
# Connect to Vercel and deploy
```

### Deploy to Railway/Render

```bash
npm run build
npm start
```

### Deploy to AWS Lambda (with serverless framework)

```bash
npm install -g serverless
serverless deploy
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
COPY tsconfig.json ./
RUN npm run build
CMD ["npm", "start"]
```

## 📊 Error Handling

The API uses consistent error responses:

| Status | Error | Meaning |
|--------|-------|---------|
| 400 | BadRequest | Invalid input |
| 401 | Unauthorized | Missing/invalid API key |
| 429 | TooManyRequests | Rate limit exceeded |
| 500 | InternalServerError | Server error |

## 🔄 Adding New Email Providers

The architecture makes it easy to add new providers:

1. **Create Provider Class:**
```typescript
// src/infrastructure/providers/YourProvider.ts
export class YourProvider implements IEmailProvider {
  async send(email: Email): Promise<string> {
    // Implementation
  }
}
```

2. **Update Repository:**
```typescript
// src/infrastructure/repositories/EmailRepository.ts
constructor(provider: IEmailProvider) {
  this.provider = provider;
}
```

3. **That's it!** The rest of the code remains unchanged.

## 🎓 Learning Outcomes

This project teaches:
- ✨ Backend development with Express.js
- ✨ Domain-Driven Design principles
- ✨ Layered architecture patterns
- ✨ API design best practices
- ✨ TypeScript for type safety
- ✨ Authentication & authorization
- ✨ Rate limiting & security
- ✨ Schema validation with Zod
- ✨ Microservice development
- ✨ Scalable code organization

## 🚀 Future Enhancements

- [ ] Database persistence (MongoDB/PostgreSQL)
- [ ] Email templates with variables
- [ ] Webhook notifications
- [ ] Email scheduling
- [ ] Bounce/delivery tracking
- [ ] Analytics dashboard
- [ ] Retry logic for failed sends
- [ ] Multi-language support
- [ ] A/B testing framework

## 🤝 Contributing

Contributions welcome! Please follow the project's DDD structure and add tests for new features.

## 📄 License

MIT License - free to use for learning and commercial projects.

## 📞 Support

Questions? Open an issue on GitHub or reach out to the maintainer.

---

**Built with ❤️ using TypeScript + Express + DDD**  
**Perfect for learning backend development and clean architecture**  
**Last Updated:** 2025
