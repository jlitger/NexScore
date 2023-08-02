FROM node:20

WORKDIR /root/frontend

COPY ./frontend /root/frontend
COPY ./common /root/common
COPY ./package.json /root/package.json
COPY ./yarn.lock /root/yarn.lock

RUN yarn install