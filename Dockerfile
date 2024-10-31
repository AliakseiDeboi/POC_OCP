FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
ENV MONGO_URI=mongodb://mongo:27017/poc_opc
CMD ["node", "opcServer.js"]