FROM node:lts-alpine

WORKDIR /u24699587

COPY package*.json ./
RUN npm install

WORKDIR /u24699587/backend
COPY backend/package*.json ./
RUN npm install

ENV CHOKIDAR_USEPOLLING=true

WORKDIR /u24699587
COPY . .

EXPOSE 8080
CMD ["sh", "-c", "npm start & node ./backend/server"]
