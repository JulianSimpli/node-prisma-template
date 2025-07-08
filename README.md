# Node.js & Prisma API template

A Node.js/Express API with authentication, built with TypeScript, Prisma ORM, and PostgreSQL.

## Features

- 🔐 JWT-based authentication (login, register, refresh tokens)
- 📚 Prisma ORM with PostgreSQL
- 📖 Swagger API documentation
- 🐳 Docker & Docker Compose setup
- ✅ Request validation with Zod
- 🛡️ Error handling middleware
- 🧹 Code linting with ESLint
- 🎨 Code formatting with Prettier
- 🚦 Continuous Integration with GitHub Actions

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm
- Docker & Docker Compose

### Development

1. **Clone and install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your JWT_SECRET to .env
   ```

3. **Start with Docker**
   ```bash
   docker-compose up
   ```

4. **Or start locally**
   ```bash
   # Start PostgreSQL (if not using Docker)
   # Set DATABASE_URL in .env
   
   pnpm run dev
   ```

### API Endpoints

- **Authentication**: `/api/auth`
  - `POST /login` - User login
  - `POST /register` - User registration
  - `GET /current-user` - Get current user (protected)
  - `POST /refresh` - Refresh access token
  - `GET /private` - Protected route example

- **Documentation**: `/api-docs` - Swagger UI

## Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint to check code quality
- `pnpm lint:fix` - Auto-fix lint issues
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting with Prettier

## Code Quality & CI

- **ESLint**: Ensures code quality and consistency. Run `pnpm lint` to check for issues.
- **Prettier**: Enforces consistent code formatting. Run `pnpm format` to auto-format your code.
- **GitHub Actions**: CI workflow runs lint, format check, and build on every push and pull request.

## Tech Stack

- **Runtime**: Node.js, Express
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose 