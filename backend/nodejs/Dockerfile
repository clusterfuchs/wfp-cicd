FROM node:23-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]