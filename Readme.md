# Fynecode Email API

A reusable email sending API built with TypeScript, Express, DDD architecture, and Resend.

## Features

- Send emails through Resend
- Domain-driven architecture
- API key authentication
- Rate limiting
- Request validation
- Attachment support
- Provider abstraction
- Type-safe TypeScript implementation

## Tech Stack

- TypeScript
- Node.js
- Express
- Resend
- Zod
- Multer
- Helmet
- CORS

## Architecture

The project follows a layered DDD-inspired structure:

src/

domain/
- Business rules
- Entities
- Value objects
- Domain errors

application/
- Use cases
- Application errors

presentation/
- HTTP controllers
- Routes
- Middleware

infrastructure/
- External services
- Resend integration


## Setup

1. Clone repository
2. Install dependencies
3. Add env variables: API_KEY, RESEND_API_KEY (if you are using resend api), ALLOWED_ORIGINS (cors) & PORT
3. Run development environment

```bash
git clone <repository>

npm install

npm run dev