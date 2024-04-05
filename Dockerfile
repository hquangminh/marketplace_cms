FROM node:18.9.0-alpine3.15

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY . .

RUN rm -f /app/.env
RUN mv /app/.env-production /app/.env

ARG DEPLOY_ENV

RUN npm run prod-build

CMD ["npm", "run", "prod-start"]
