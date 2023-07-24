.PHONY: install_backend install_frontend create_db clear_db start_backend_server start_frontend_server start_frontend_server_dev build_frontend help

default: help

install_all: install_backend install_frontend

setup: install_all generate_sll_certs remove_tables setup_db setup_env build_frontend_dev

setup_env:
	python3 scripts/setup_env.py

setup_db:
	python3 scripts/setup_db.py

install_backend:
	pip3 install -r backend/requirements.txt

install_frontend:
	cd frontend && npm install

clear_db:
	python3 backend/db/clear_tables.py

remove_tables:
	python3 backend/db/remove_tables.py

build_frontend:
	cd frontend && npm run build

build_frontend_dev:
	cd frontend && npm run build_dev

start_backend_server:
	cd backend && python3 app.py

start_frontend_server_dev:
	cd frontend && npm start

start_frontend_server:
	cd frontend/public && python3 ../server.py

generate_sll_certs:
	openssl req -x509 -newkey rsa:4096 -nodes -out frontend/cert_front.pem -keyout key.pem -days 365 \
	&& openssl req -x509 -newkey rsa:4096 -nodes -out backend/cert_backend.pem -keyout key.pem -days 365 \

help:
	@echo "Available recipes:"
	@echo "make install_all                 - install backend and frontend dependencies"
	@echo "make install_backend             - install backend dependencies"
	@echo "make install_frontend            - install frontend dependencies"
	@echo "make setup_db                    - create database tables"
	@echo "make setup_env                   - seutp environment variables"
	@echo "make clear_db                    - clear database tables"
	@echo "make build_frontend_dev          - build frontend for production"
	@echo "make build_frontend_dev          - build frontend for development"
	@echo "make start_backend_server        - start backend server"
	@echo "make start_frontend_server_dev   - start frontend server in development mode"
	@echo "make start_frontend_server       - start frontend server"
	@echo "make help                        - display this help message"
