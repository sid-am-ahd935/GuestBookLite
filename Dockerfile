FROM node:18

WORKDIR /app/node/

COPY package*.json /app/node/

RUN npm install

COPY . /app/node/

EXPOSE ${SERVER_PORT}

CMD ["npm", "start"]
