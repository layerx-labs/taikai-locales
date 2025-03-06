FROM node:18.16.0-alpine3.17 AS release

WORKDIR /app
COPY package*.json ./
COPY . .

RUN apk add python3 make \
    g++ \
    nodejs \
    yarn

RUN npm install -g npm@9
RUN npm install
RUN npm run build


