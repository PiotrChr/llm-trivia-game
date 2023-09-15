FROM python:3.10-slim as builder

RUN apt-get update && apt-get install -y make sqlite3 && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./backend/requirements.txt ./backend/
RUN pip install --upgrade pip && pip install --no-cache-dir -r ./backend/requirements.txt 
RUN pip show gunicorn

COPY ./backend/ ./backend/
COPY ./Makefile ./
COPY ./scripts/ ./scripts/

RUN make remove_tables
RUN make setup_db
RUN make load_fixtures

RUN sqlite3 backend/db/db.sqlite .tables

FROM python:3.10-slim
RUN apt-get update && apt-get install -y make sqlite3 && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY resources/nginx/backend.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/local/lib/python3.10/site-packages/ /usr/local/lib/python3.10/site-packages/
COPY --from=builder /usr/local/bin/gunicorn /usr/local/bin/gunicorn

WORKDIR /app

COPY --from=builder /app/backend/ ./backend/
COPY --from=builder /app/scripts/ ./scripts/
COPY --from=builder /app/Makefile ./
COPY --from=builder /app/backend/db/db.sqlite ./backend/db/db.sqlite

RUN sqlite3 backend/db/db.sqlite .tables

CMD sh -c "cd backend && gunicorn server:app --bind 0.0.0.0:5000 --worker-class geventwebsocket.gunicorn.workers.GeventWebSocketWorker"

EXPOSE 5000
