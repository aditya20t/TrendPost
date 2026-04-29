# Frontend Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build step (optional for dev, but good for base)
# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]
