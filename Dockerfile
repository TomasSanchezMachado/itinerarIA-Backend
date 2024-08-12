FROM node:21.7.1

RUN mkdir -p /home/app

COPY . /home/app

EXPOSE 3000

CMD ["node", "/src/app.ts"]