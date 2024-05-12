FROM node:18

WORKDIR /app/node/

COPY package*.json /app/node/

RUN npm install

COPY . /app/node/

CMD ["npm", "start"]
