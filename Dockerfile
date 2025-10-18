# ---------- Builder ----------
FROM node:20-bookworm-slim AS builder
WORKDIR /app
# Herramientas mínimas (por si algún módulo nativo las requiere)
RUN apt-get update && apt-get install -y python3 make g++ ca-certificates && rm -rf /var/lib/apt/lists/*

# Cache eficiente
COPY package.json package-lock.json ./
RUN npm ci

# Copiamos el resto y construimos
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- Runner ----------
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
ENV NEXT_TELEMETRY_DISABLED=1

# Copiamos el artefacto standalone y los estáticos
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 8080
CMD ["node", "server.js"]
