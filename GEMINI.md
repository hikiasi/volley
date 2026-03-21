# Gemini Project: VOLLEYDZEN Telegram Mini App

## Project Overview

This is a **Telegram Mini App** for the **VOLLEYDZEN** volleyball community. The application is built as a monolithic web application using **Next.js 14 (App Router)**, serving both the frontend and a backend REST API.

The primary goal of the project is to provide a unified platform for the community, allowing users to:
- Browse and book spots in volleyball camps.
- Purchase and follow online training courses.
- Manage their user profile and progress.
- Receive notifications via the Telegram Bot.

### Key Technologies
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS.
- **UI Components**: `shadcn/ui` built on Radix UI.
- **Backend**: Next.js API Routes.
- **Database**: PostgreSQL with **Prisma ORM** for type-safe database access.
- **Authentication**: Custom flow using Telegram Web App `initData` validation (HMAC-SHA256) and JWTs.
- **External Services**:
    - **YooKassa**: Payment processing.
    - **Telegram Bot API**: Notifications and authentication.
    - **Vimeo**: Video hosting for courses.
    - **Timeweb Cloud**: Hosting and S3-compatible storage.
    - **Redis**: Caching and rate-limiting (planned).

## Building and Running

### 1. Installation
First, install the project dependencies:
```bash
npm install
```

### 2. Environment Setup
Create a local environment file by copying the example:
```bash
cp .env.example .env.local
```
Then, edit `.env.local` and fill in the required variables, especially `DATABASE_URL`, `JWT_SECRET`, and `TELEGRAM_BOT_TOKEN`.

### 3. Database Setup
To set up and seed the PostgreSQL database, run the following commands in order:
```bash
# Apply the schema to the database
npm run db:push

# Generate the Prisma Client
npm run db:generate

# Seed the database with initial test data
npm run db:seed
```
You can also use `npm run db:studio` to open the Prisma Studio GUI and view the database.

### 4. Running the Application
- **Development:** To run the development server (with hot-reloading):
  ```bash
  npm run dev
  ```
  The application will be available at `http://localhost:3000`.

- **Production Build:** To create a production-ready build:
  ```bash
  npm run build
  ```

- **Production Start:** To run the production server:
  ```bash
  npm run start
  ```

### 5. Linting
To check the code for style and errors:
```bash
npm run lint
```

## Development Conventions

- **Structure**: The project uses the Next.js App Router. All pages and API routes are located within the `app/` directory.
- **Database**: All database interactions must go through the Prisma client (`lib/db.ts`) to maintain type safety. Do not write raw SQL queries.
- **UI**: The user interface is constructed using `shadcn/ui` components. New components should follow this convention. Custom styling is done via Tailwind CSS utility classes.
- **Authentication**: Protected routes and APIs are guarded by JWT validation. The authentication flow is tightly coupled with the Telegram Mini App SDK.
- **API Design**: Backend logic is exposed via RESTful API endpoints located in `app/api/`.
- **Code Style**: The project is configured with ESLint for consistent code style. Please run `npm run lint` before committing changes.
- **Types**: The project uses TypeScript. Strive for strong typing and avoid using `any` where possible.
