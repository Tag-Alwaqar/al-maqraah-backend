FROM node:20-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

FROM node:20-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

#RUN npm run migration:run

CMD [ "node", "dist/main.js" ]
