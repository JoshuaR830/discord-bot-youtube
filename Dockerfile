FROM node:12

WORKDIR /

COPY package*.json ./

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

RUN npm install

COPY . .

EXPOSE 6001

CMD ["node", "index.js"]