# ---- Builder ----
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Copia la salida standalone + estáticos
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Si NO tienes carpeta public, comenta la siguiente línea
COPY --from=builder /app/public ./public
# Cloud Run usa 8080
ENV PORT=8080
EXPOSE 8080
# Next standalone genera server.js en la raíz copiada arriba
CMD ["node", "server.js"]
