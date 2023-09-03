FROM node:alpine

WORKDIR /app

COPY package.json package.json
RUN npm i

COPY . /app/


CMD ["npm", "run", "dev"]