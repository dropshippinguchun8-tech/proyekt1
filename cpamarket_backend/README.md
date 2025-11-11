# CPAMaRKeT.Uz Backend

Express.js + PostgreSQL backend for the CPAMaRKeT.Uz CPA platform. Provides authentication, offer and lead management, and aggregated statistics for affiliates and advertisers.

## Features

- JWT-based authentication with role support (`affiliate`, `advertiser`)
- CRUD REST APIs for offers and leads with role-aware access control
- Aggregated statistics endpoint for total clicks, leads, and revenue
- Sequelize ORM models with PostgreSQL storage
- Dockerized deployment with `docker-compose`

## Project Structure

```
src/
  app.js                # Express app and route wiring
  server.js             # Server bootstrap and database sync
  config/               # Environment and Sequelize configuration
  controllers/          # Route handlers
  middleware/           # Auth and error handling middleware
  models/               # Sequelize models and associations
  routes/               # Express routers
  utils/                # Helpers (JWT token, ApiError)
Dockerfile
docker-compose.yml
.env.example
```

## Prerequisites

- Node.js 20+
- PostgreSQL 13+

## Setup

```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secret
npm install
npm run dev
```

The API listens on `http://localhost:4000`.

## Docker

```bash
cp .env.example .env
# In Docker, DB_HOST is overridden to the internal service name `db`
docker compose up --build
```

## Available Scripts

- `npm run dev` – Start the API in watch mode with Nodemon
- `npm start` – Start the API in production mode

## Key Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET/POST/PUT/DELETE /api/offers`
- `GET/POST/PUT/DELETE /api/leads`
- `GET /api/stats`

All non-auth routes require a valid `Authorization: Bearer <token>` header.
