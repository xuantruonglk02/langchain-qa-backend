# syntax=docker/dockerfile:experimental

FROM node:18.16.1

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY . .
RUN npm install
RUN npm run build

CMD ["npm", "run", "start:trace"]
EXPOSE 3000
