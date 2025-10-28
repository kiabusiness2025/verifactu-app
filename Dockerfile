FROM node:18-alpine
WORKDIR /app

# Copy package.json first to leverage Docker cache
COPY package*.json ./

# Use npm install to avoid failing when package-lock.json is missing
RUN npm install --production --silent

# Copy rest of the project
COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["node","server.js"]