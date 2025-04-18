FROM node:23-alpine

RUN addgroup -g 1001 nodejs && \
    adduser -u 1001 -G nodejs -D nodejs

RUN apk add chromium

WORKDIR /usr/src/app

ENV CHROME_BIN=/usr/bin/chromium-browser

COPY package*.json .

RUN pwd

RUN ls

RUN npm install -g @angular/cli

RUN npm ci

COPY . .

USER nodejs

CMD [ "npm", "test-headless" ]