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
# Cloud Run escucha en 8080
ENV PORT=8080
EXPOSE 8080

# Crea un usuario no-root para mayor seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

# Copia salida Next standalone + estáticos (y public si existe)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Si no tienes carpeta public, esta línea no falla aunque no exista:
COPY --from=builder /app/public ./public

# Next standalone genera server.js en la raíz copiada arriba
CMD ["node", "server.js"]
