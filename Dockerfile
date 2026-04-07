FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Source is mounted via volume in dev — this COPY is for production use
COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
