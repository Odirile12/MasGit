# FROM node:22.9.0
# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY frontend/ .
# EXPOSE 3000
# CMD ["npm", "start"]


FROM node:22.9.0

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy webpack config and babel config from root
COPY webpack.config.js ./
COPY .babelrc ./

# Copy frontend source code
COPY frontend/ ./

# Expose port
EXPOSE 8080

# Start the development server
CMD ["npm", "start"]