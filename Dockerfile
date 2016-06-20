FROM node:argon
MAINTAINER Rodrigo Araujo <hello@dygufa.com>

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Run build script (webpack)
RUN npm run build

EXPOSE 8090
CMD [ "npm", "start" ]