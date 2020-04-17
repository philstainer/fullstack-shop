FROM node:13-slim

RUN apt-get -qy update

RUN apt-get -qy install openssl

COPY . /opt/app

ARG DATABASE_URL

ENV DATABASE_URL "$DATABASE_URL"

WORKDIR /opt/app

RUN yarn

CMD yarn dev