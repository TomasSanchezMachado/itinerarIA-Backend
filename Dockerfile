FROM node:21.7.1

WORKDIR /home/app

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run" ,"start:dev"]