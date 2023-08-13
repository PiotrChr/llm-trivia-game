FROM python:3.10-slim

RUN apt-get update && apt-get install -y make && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./backend/requirements.txt ./backend/
RUN pip install --upgrade pip && pip install -r ./backend/requirements.txt

COPY ./backend/ ./backend/
COPY ./Makefile ./
COPY ./scripts/ ./scripts/

RUN make install_backend
RUN make remove_tables
RUN make setup_db
RUN make load_fixtures

EXPOSE 5000

CMD ["make", "start_backend_server"]