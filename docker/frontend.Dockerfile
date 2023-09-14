FROM node:14 as build-stage

WORKDIR /app

COPY ./frontend/package*.json ./
RUN npm install


COPY ./frontend/ ./


RUN npm run build


FROM nginx:latest as serve-stage

COPY --from=build-stage /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]