# StoryForge

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: Node Package Manager (bundled with Node.js)
- **PostgreSQL**: An active PostgreSQL database server

## Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd StoryForge
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Copy `.example.env` to `.env` in the root directory and configure the environment variables:
   ```bash
   cp .example.env .env
   ```

4. **Run database migrations**:
   ```bash
   npm run db:migrate
   ```

## Environment Variables

The application validates environment configuration on application startup. Below are the variables defined in `.example.env`:

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `NODE_ENV` | No | `development` | Runtime environment (`development`, `test`, `production`). |
| `PORT` | No | `3000` | Port number for the HTTP server. |
| `PG_DATABASE` | No | `postgresql://user:password@localhost:5432/database` | PostgreSQL connection URL string. |
| `LOG_LEVEL` | No | `http` | Logging verbosity level. |
| `JWT_SECRET` | No | `thequickbrownfoxjumpedoverthelog` | Secret key used to sign and verify JWT authentication tokens. |
| `BREVO_API_KEY` | **Yes** | — | API key for the Brevo email service provider. |
| `BREVO_EMAIL` | **Yes** | — | Sender email address for Brevo notifications. |
| `STRIPE_SECRET_KEY` | **Yes** | — | Secret key for Stripe payment processing. |
| `STRIPE_WEBHOOK_SECRET` | **Yes** | — | Secret key for verifying incoming Stripe webhook signatures. |
| `API_BASE_URL` | No | `http://localhost:3000` | Base URL of the API service. |

## Running the Project

### Development Server

Start the application with hot-reloading:

```bash
npm run start:dev
```

Alternatively, start with SWC for faster compilation:

```bash
npm run start:fast
```

### Production

Compile the TypeScript source code:

```bash
npm run build
```

Start the compiled production server:

```bash
npm run start:prod
```

### Database Operations

- **Generate database migrations**: `npm run db:generate`
- **Execute database migrations**: `npm run db:migrate`
- **Launch Drizzle Studio UI**: `npm run db:studio`

### Testing and Formatting

- **Run unit tests**: `npm run test`
- **Run end-to-end tests**: `npm run test:e2e`
- **Lint code**: `npm run lint`
- **Format code**: `npm run format`

## Available Routes

### Application & System Routes

| HTTP Method | Path | Description | Parameters / Request Body |
| --- | --- | --- | --- |
| `GET` | `/api/v1` | Root API health and welcome endpoint. | None |
| `GET` | `/errors/:id` | Testing endpoint that throws HTTP exceptions matching the status code `id`. | Path parameter `id`: HTTP status code string (`400`, `401`, `403`, `404`, `409`, `500`, `503`). |
| `GET` | `/*` | Wildcard route that handles unmapped requests and returns a `404` error payload. | None |

### Authentication Routes

Base path: `/api/v1/auth`

| HTTP Method | Path | Description | Request Body |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Registers a new user account. | JSON object: `{ "email": "<email>", "password": "<password>" }` |
| `POST` | `/api/v1/auth/login` | Authenticates user credentials and returns a JWT token. | JSON object: `{ "email": "<email>", "password": "<password>" }` |

## Basic API Usage

### 1. Health Check

**Request:**

```bash
curl -X GET http://localhost:3000/api/v1
```

**Response:**

```json
{
  "success": true,
  "message": "Welcome to StoryForge"
}
```

### 2. User Registration

**Request:**

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "user registered successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2026-09-10T14:00:00.000Z"
  },
  "meta": null
}
```

### 3. User Login

**Request:**

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \gi
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "user logged in successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2026-09-10T14:00:00.000Z"
  },
  "meta": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
