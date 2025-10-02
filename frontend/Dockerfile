# FROM node:18-alpine

# WORKDIR /app

# # Copy package files
# COPY frontend/package*.json ./

# # Install dependencies
# RUN npm install

# # Copy frontend source code
# COPY frontend/ ./

# # Create public directory and index.html if it doesn't exist
# RUN mkdir -p public && \
#     echo '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>React App</title></head><body><div id="root"></div></body></html>' > public/index.html

# # Build the app
# RUN npm run build

# # Install a simple HTTP server to serve the static content
# RUN npm install -g serve

# # Expose port 8080
# EXPOSE 8080

# # Start the server
# CMD ["serve", "-s", "build", "-l", "8080"]

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