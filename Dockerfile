# Usamos una imagen base de Node.js ligera y segura.
FROM node:20-bookworm-slim

# Establecemos el directorio de trabajo dentro del contenedor.
WORKDIR /app

# Copiamos los ficheros de dependencias para aprovechar la caché de Docker.
COPY package.json package-lock.json ./

# Instalamos únicamente las dependencias de producción para mantener la imagen ligera.
RUN npm ci --only=production

# Copiamos el resto del código de la aplicación (principalmente server.js).
COPY . .

# Exponemos el puerto en el que la aplicación va a escuchar.
ENV PORT=8080
EXPOSE 8080

# El comando para iniciar la aplicación.
CMD ["node", "server.js"]
