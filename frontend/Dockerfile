 #52_Masanabo
FROM node:18-alpine

WORKDIR /app

# Copy root package files (shared dependencies)
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy webpack config
COPY webpack.config.js ./

# Copy frontend source code
COPY frontend/ ./frontend/

# Expose port 8080
EXPOSE 8080

# Start webpack dev server
CMD ["npm", "start"]