# ====== Etapa de build ======
FROM node:20-alpine AS build
WORKDIR /app

# Copiamos SOLO los manifests primero para aprovechar cache
COPY package*.json ./

# DEBUG: asegura que no llega vacío (fallará si está vacío)
RUN test -s package.json && node -e "JSON.parse(require('fs').readFileSync('package.json','utf8'))" && echo 'package.json OK' || (echo 'package.json vacío/incorrecto' && exit 1)

# Instala deps (usa npm install; no usamos npm ci porque aún no hay lock)
RUN npm install --omit=dev

# Copiamos el resto del código
COPY . .

# Si más adelante compilas (React/Next/Vite):
# RUN npm run build

# ====== Etapa de runtime ======
FROM node:20-alpine
WORKDIR /app

# Copiamos el resultado del build
COPY --from=build /app /app

ENV PORT=8080
EXPOSE 8080
CMD ["npm","start"]
