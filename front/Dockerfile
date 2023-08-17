FROM node:alpine

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm i

COPY public public
COPY src src
COPY vite.config.ts vite.config.ts
COPY .eslintrc.cjs .eslintrc.cjs
COPY tsconfig.node.json tsconfig.node.json
COPY tsconfig.json tsconfig.json

EXPOSE 5173

CMD ["npm", "run", "local-dev"]