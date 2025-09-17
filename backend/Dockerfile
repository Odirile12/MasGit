# backend/Dockerfile
FROM node:22.9.0

WORKDIR /app

# Copy root package.json
COPY package*.json ./
RUN npm install

# Copy only backend files
COPY backend/ .

EXPOSE 5000
CMD ["node", "server.js"]
