FROM node:slim AS build

RUN apk add chromium

WORKDIR /usr/src/app

ENV CHROME_BIN=/usr/bin/chromium-browser

COPY package*.json .

RUN npm install -g @angular/cli

RUN npm ci

COPY . .

RUN npm run test-headless 

RUN npm run build

################################################

FROM node:slim

WORKDIR /usr/app

COPY --from=build /usr/src/app/dist/angular-app .

CMD node server/server.mjs

EXPOSE 4000 
