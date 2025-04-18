FROM node:slim

RUN addgroup --gid 1001 nodejs && \
    adduser --uid 1001 --guid nodejs

RUN apk add chromium

WORKDIR /usr/src/app

ENV CHROME_BIN=/usr/bin/chromium-browser

COPY package*.json .

RUN npm install -g @angular/cli

RUN npm ci

COPY . .

USER nodejs

CMD [ "npm", "test-headless" ]