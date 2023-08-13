ARG API_HOST=localhost
ARG API_PORT=9000

FROM node:14

ENV API_HOST=$API_HOST
ENV API_PORT=$API_PORT


# Install necessary utilities and Python
RUN apt-get update \
    && apt-get install -y make python3 python3-pip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./frontend/package*.json ./frontend/
RUN cd frontend && npm install

COPY ./frontend/requirements.txt ./frontend/
RUN pip3 install --upgrade pip && pip3 install -r frontend/requirements.txt

COPY ./Makefile ./
COPY ./scripts/ ./scripts/
COPY ./frontend/ ./frontend/

RUN make build_frontend_dev
RUN make generate_manifest

EXPOSE 3000

CMD ["make", "build_and_start"]