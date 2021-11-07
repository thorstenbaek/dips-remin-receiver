FROM node:14-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

RUN npm install

RUN npm install -D
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./dist .

EXPOSE 80

ENV TZ=Europe/Oslo
ENV IN_CONTAINER=1
ENV EHRSTORE_LOCATION_URL=https://ehrstore.sandbox.dips.no


CMD [ "node", "index.js" ]