# Base image
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN npm install -g pnpm && pnpm install
COPY . .

# Development stage
FROM base AS dev
RUN npx prisma generate
EXPOSE 3000
CMD ["pnpm", "run", "dev"]

# Production stage
FROM base AS prod
RUN pnpm run build && npx prisma generate
EXPOSE 3000
CMD ["pnpm", "run", "start"] 