FROM node:16.13-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf

COPY . .

RUN npm run build


CMD ["npm", "start"]

