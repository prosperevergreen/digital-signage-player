# REACT APP
FROM node:16-alpine as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --silent
COPY . .
# RUN npm install react-scripts@4.0.1 -g silent
RUN npm run build

# NGINX SERVER
FROM nginx:1.16.0-alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

# Get wait for container script
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.8.0/wait /wait

RUN chmod +x /wait

CMD ["nginx", "-g", "daemon off;"]