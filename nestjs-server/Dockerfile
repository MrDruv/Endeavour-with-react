# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source files INCLUDING prisma schema
COPY . .
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Build app
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY ./nestjs-server.env .env

CMD ["node", "dist/main"]
