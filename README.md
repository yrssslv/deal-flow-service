# Deal Flow Service

**Auction & Chat Engine**

A high-performance, real-time backend service for managing atomic auctions and live interactions. Built with scalability and data integrity as core tenets.

## Architecture

This project follows **Clean Architecture** principles to separate business logic from transport layers.

- **Domain-Driven**: Logic resides in Services, isolated from Controllers.
- **Real-time Scaling**: Utilizes Redis Adapter for Socket.io to support horizontal scaling of WebSocket servers.
- **Task Management**: Asynchronous auction completion handling via RabbitMQ.

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript (Strict)
- **Database**: PostgreSQL 17 (with `pgvector`)
- **ORM**: Prisma 7
- **Message Queue**: RabbitMQ
- **Caching / PubSub**: Redis
- **Containerization**: Docker & Docker Compose

## Key Engineering Solutions

- **Atomic Bidding**: Utilizes `prisma.$transaction` and database locks to ensure bid integrity and prevent race conditions.
- **Vector Search**: Integrated `pgvector` for future-proofing semantic search capabilities on auction items.
- **Lifecycle Automation**: Distributed task scheduling with RabbitMQ to handle auction closures precisely when they expire.

## Setup

### Prerequisites

- Docker & Docker Compose
- Node.js (>= 20)
- pnpm

### Installation

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    pnpm install
    ```
3.  **Environment Configuration**:
    Copy `.env.example` to `.env` and adjust values if necessary.
    ```bash
    cp .env.example .env
    ```

### Running with Docker

Start the entire infrastructure (DB, Redis, RabbitMQ, and API):

```bash
docker compose up -d
```

### Running Locally (Dev)

1.  Start infrastructure services:
    ```bash
    docker compose up db redis rabbitmq -d
    ```
2.  Apply database migrations:
    ```bash
    pnpm prisma migrate dev
    ```
3.  Start the application:
    ```bash
    pnpm start:dev
    ```

## Documentation

- **API Documentation**: Available at `/api/docs` (Swagger) when the server is running.
- **Project Context**: See `GEMINI.md` for detailed architectural rules and domain logic.

## Project Structure

```
src/
├── common/         # Shared adapters, guards, pipes
├── prisma/         # Database configuration & service
├── modules/        # Feature modules (Auth, Auctions, Bids, etc.)
└── main.ts         # Entry point
```
