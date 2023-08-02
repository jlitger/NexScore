# Current node version, do not care which OS etc. at this time
FROM node:20

WORKDIR /root/backend

COPY ./backend /root/backend
COPY ./common /root/common
COPY ./package.json /root/package.json
COPY ./yarn.lock /root/yarn.lock

RUN yarn install