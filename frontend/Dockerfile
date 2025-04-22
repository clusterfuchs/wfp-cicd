FROM node:slim AS build

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install -g @angular/cli

RUN npm ci

COPY . .

RUN npm run build

################################################

FROM node:slim

WORKDIR /usr/app

ENV NODE_ENV=production

COPY --from=build /usr/src/app/dist/angular-app .

CMD node server/server.mjs

EXPOSE 4000 
