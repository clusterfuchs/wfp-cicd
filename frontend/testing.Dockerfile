FROM node:23-alpine

RUN addgroup -g 1001 nodejs && \
    adduser -u 1001 -G nodejs -D nodejs

RUN apk add chromium

WORKDIR /usr/src/app

RUN chown nodejs:nodejs /usr/src/app

USER nodejs

ENV CHROME_BIN=/usr/bin/chromium-browser

COPY package*.json .

RUN npm install -g @angular/cli

RUN npm ci

COPY . .


CMD [ "npm", "run", "test-headless" ]