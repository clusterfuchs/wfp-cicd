FROM node:23-alpine as build

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

FROM node:23-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json .

RUN npm ci --omit=dev

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]