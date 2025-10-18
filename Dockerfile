# ---------- Builder ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos solo manifests para aprovechar la caché
COPY package.json package-lock.json ./
RUN npm ci

# Copiamos el resto y construimos
COPY . .
RUN npm run build

# ---------- Runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Copiamos el output standalone y los estáticos
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 8080
# El server standalone trae server.js en la raíz que respeta PORT
CMD ["node", "server.js"]
