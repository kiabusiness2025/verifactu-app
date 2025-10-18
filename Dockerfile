# ---------- Builder ----------
FROM node:20-alpine AS builder
# Dependencias de compilación para módulos nativos (sharp, etc.)
RUN apk add --no-cache libc6-compat python3 make g++ openssl
WORKDIR /app

# Mejor caché: primero manifests
COPY package.json package-lock.json ./
RUN npm ci

# Copia el resto del código
COPY . .

# Desactiva telemetría de Next en CI
ENV NEXT_TELEMETRY_DISABLED=1

# Construye Next en modo standalone
RUN npm run build

# ---------- Runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
ENV NEXT_TELEMETRY_DISABLED=1

# Copiamos el artefacto standalone y estáticos
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# (Opcional) Usuario no-root
# RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
# USER nextjs

EXPOSE 8080
CMD ["node", "server.js"]
