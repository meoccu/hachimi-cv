# ===== Builder =====
FROM node:20-bookworm-slim AS builder

WORKDIR /app
ENV PUPPETEER_SKIP_DOWNLOAD=true

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate && npm run build

# ===== Runner =====
FROM node:20-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Chromium + 中文字体 + 必要库
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-noto-cjk fonts-noto-color-emoji fonts-wqy-zenhei fonts-wqy-microhei \
    ca-certificates wget gnupg \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon0 \
    libxcomposite1 libxdamage1 libxrandr2 libgbm1 libpango-1.0-0 libasound2 \
 && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]