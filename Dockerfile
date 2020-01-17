FROM node:12

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 6001

CMD ["node", "index.js"]