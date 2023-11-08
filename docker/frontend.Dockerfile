FROM node:14 as build-stage

WORKDIR /app
ARG BACKEND_HOST
ARG APP_GOOGLE_CLIENT_ID

ENV BACKEND_HOST=${BACKEND_HOST}
ENV APP_GOOGLE_CLIENT_ID=${APP_GOOGLE_CLIENT_ID}

COPY ./frontend/package*.json ./
RUN npm install

COPY ./frontend/ ./

RUN npm run build


FROM nginx:latest as serve-stage

COPY resources/nginx/frontend.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/public /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

