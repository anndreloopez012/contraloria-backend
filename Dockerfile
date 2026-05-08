FROM node:20-alpine

WORKDIR /app

ARG NODE_OPTIONS=--max-old-space-size=8192
ENV NODE_OPTIONS=${NODE_OPTIONS}

RUN apk add --no-cache postgresql-client mariadb-client tar gzip

COPY . .

RUN yarn install
RUN yarn build

EXPOSE 1337

CMD ["yarn", "start"]
