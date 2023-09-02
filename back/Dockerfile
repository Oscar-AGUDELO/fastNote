FROM node:alpine

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm i

COPY src src
COPY test test
COPY tsconfig.json tsconfig.json
COPY nodemon.json nodemon.json

CMD npm start


