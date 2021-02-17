# Specifies where to get the base image (Node v12 in our case) and creates a new container for it
FROM node:13-alpine

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

# Set working directory. Paths will be relative this WORKDIR.
WORKDIR /app

# Install dependencies
ADD package*.json ./
# Copy source files from host computer to the container
ADD . .

RUN npm install

# Run the app
CMD [ "npm", "start" ]