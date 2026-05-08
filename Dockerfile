FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client mariadb-client tar gzip

COPY . .

RUN yarn install
RUN yarn build

EXPOSE 1337

CMD ["yarn", "start"]
