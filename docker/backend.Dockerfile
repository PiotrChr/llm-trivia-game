# ---- Build Stage ----
FROM python:3.10-slim as builder

# Install system packages required for build
RUN apt-get update && apt-get install -y make && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install python packages
COPY ./backend/requirements.txt ./backend/
RUN pip install --upgrade pip && pip install -r ./backend/requirements.txt
RUN pip show gunicorn

# Copy application and other necessary files for the build
COPY ./backend/ ./backend/
COPY ./Makefile ./
COPY ./scripts/ ./scripts/

# Setup the database and load fixtures
RUN make remove_tables
RUN make setup_db
RUN make load_fixtures

# ---- Final Stage ----
FROM python:3.10-slim
RUN apt-get update && apt-get install -y make && apt-get clean && rm -rf /var/lib/apt/lists/*


COPY resources/nginx/backend.conf /etc/nginx/conf.d/default.conf

# Copy installed python packages from builder stage
COPY --from=builder /usr/local/lib/python3.10/site-packages/ /usr/local/lib/python3.10/site-packages/
RUN pip show gunicorn
RUN find /usr/local -name gunicorn


WORKDIR /app

# Copy necessary files from builder stage and the application
COPY --from=builder /app/backend/ ./backend/
COPY --from=builder /app/scripts/ ./scripts/
COPY --from=builder /app/Makefile ./

# This command will be executed when the container starts
CMD ["make", "start_gunicorn_backend_live"]

EXPOSE 5000
