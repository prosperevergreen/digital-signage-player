# This line fetches the Node Docker image with tag "10"
# from Docker Hub.
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# dev mode
# RUN npm install -g nodemon 

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 5000

# Get wait for container script
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.8.0/wait /wait

RUN chmod +x /wait

CMD sh -c "/wait && npm run start"