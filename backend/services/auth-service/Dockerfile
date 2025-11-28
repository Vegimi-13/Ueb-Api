FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# DO NOT run prisma here (yet)
# DO NOT expose a hard-coded port (compose handles ports)

CMD ["npm", "run", "dev"]
