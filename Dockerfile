FROM node:13.7-stretch-slim

WORKDIR /code
COPY package.json /code/

RUN npm install
