# Node.js & Prisma API template

A modern Node.js/Express API with authentication, built with TypeScript, Prisma ORM, and PostgreSQL. This project provides a robust foundation for building scalable backend services with comprehensive security features and development tools.

## ✨ Features

- 🔐 **JWT-based authentication** with refresh tokens
- 📚 **Prisma ORM** with PostgreSQL database
- 📖 **Swagger/OpenAPI documentation** with interactive UI
- 🐳 **Docker & Docker Compose** for easy development and deployment
- ✅ **Request validation** with Zod schemas
- 🛡️ **Security middleware** (Helmet, CORS, Rate limiting)
- 🧪 **Testing setup** with Jest and Supertest
- 🧹 **Code quality** with ESLint and Prettier
- 📝 **Git hooks** with Husky and lint-staged
- 🚦 **Continuous Integration** with GitHub Actions
- 📊 **Logging** with Winston
- 🔄 **Hot reload** development with tsx

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **pnpm** package manager
- **Docker & Docker Compose** (optional, for containerized development)
- **PostgreSQL** (if running locally)

### Development Setup

1. **Clone the repository and install dependencies**
   ```bash
   git clone https://github.com/JulianSimpli/node-prisma-template.git
   cd app-api
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following variables in your `.env` file:
   ```env
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=900
   REFRESH_EXPIRES_IN=604800
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/appdb
   ```

3. **Start with Docker (Recommended)**
   ```bash
   docker-compose up --build
   ```
   
   This will start both the PostgreSQL database and the API server.

4. **Or start locally**
   ```bash
   # Start PostgreSQL (if not using Docker)
   # Ensure DATABASE_URL is set in .env
   
   # Run database migrations
   npx prisma migrate deploy
   
   # Start development server
   pnpm dev
   ```

## 📚 API Documentation

Once the server is running, you can access:

- **Swagger UI**: `http://localhost:3000/api-docs`
- **API Base URL**: `http://localhost:3000/api`

### Available Endpoints

#### Authentication (`/api/auth`)
- `POST /login` - User login
- `POST /register` - User registration  
- `GET /current-user` - Get current user (protected)
- `POST /refresh` - Refresh access token
- `GET /private` - Protected route example

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm test` | Run tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm lint` | Run ESLint to check code quality |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check code formatting |

## 🏗️ Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.routes.ts
│   ├── auth.schema.ts
│   ├── auth.service.ts
│   ├── auth.types.ts
│   └── auth.utils.ts
├── common/              # Shared utilities
│   ├── enums/          # TypeScript enums
│   ├── errors/         # Custom error classes
│   ├── logger.ts       # Winston logger
│   └── middlewares/    # Express middlewares
├── users/              # Users module
│   ├── users.schema.ts
│   ├── users.service.ts
│   └── users.types.ts
├── app.ts              # Express app configuration
├── config.ts           # Environment configuration
├── index.ts            # Application entry point
├── prisma.ts           # Prisma client
└── swagger.ts          # Swagger documentation
```

## 🗄️ Database

### Database Commands
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

## 🔒 Security Features

- **JWT Authentication** with configurable expiration times
- **Password hashing** (implemented in auth service)
- **CORS protection** with configurable allowed origins
- **Rate limiting** to prevent abuse
- **Helmet.js** for security headers
- **Request validation** with Zod schemas
- **Error handling** with custom error classes

## 🧪 Testing

The project includes a comprehensive testing setup:

- **Jest** as the testing framework
- **Supertest** for API endpoint testing
- **Test coverage** reporting
- **Test database** configuration

Run tests with:
```bash
pnpm test              # Run all tests
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage
```

## 🐳 Docker

### Development
```bash
docker-compose up
```

### Production Build
```bash
docker build --target prod -t app-api .
docker run -p 3000:3000 app-api
```

## 🔄 CI/CD

The project includes GitHub Actions workflow that runs on:
- Push to `main` and `develop` branches
- Pull requests to `main` and `develop` branches

**CI Pipeline includes:**
- Code formatting check
- Linting
- Database migrations
- Tests
- Build verification

## 🛠️ Tech Stack

- **Runtime**: Node.js 20, Express 5
- **Language**: TypeScript 5
- **Database**: PostgreSQL 15 with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Validation**: Zod schemas
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest
- **Code Quality**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged
- **Containerization**: Docker & Docker Compose
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate limiting