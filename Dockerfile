# ==========================================
# STAGE 1: Build React/Vite Frontend
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

RUN npm run build


# ==========================================
# STAGE 2: Express Backend
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev

COPY server.js ./
COPY .env* ./

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "server.js"]