FROM node:20-alpine AS build
WORKDIR /app
# Copia solo los manifests primero (mejor cache)
COPY package*.json ./
RUN npm install --omit=dev

# Copia el resto del código
COPY . .
# Si tuvieras build real (React/Next/etc.) ejecuta aquí:
# RUN npm run build

# Runtime
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app /app
ENV PORT=8080
EXPOSE 8080
CMD ["npm","start"]
