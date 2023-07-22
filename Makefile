.PHONY: install_backend install_frontend create_db clear_db start_backend_server start_frontend_server start_frontend_server_dev build_frontend help

default: help

install_all: install_backend install_frontend

install_backend:
	pip install -r backend/requirements.txt

install_frontend:
	cd frontend && npm install

create_db:
	python backend/db/create_tables.py

clear_db:
	python backend/db/clear_tables.py

build_frontend:
	cd frontend && npm run build

build_frontend_dev:
	cd frontend && npm run build_dev

start_backend_server:
	cd backend && python app.py

start_frontend_server_dev:
	cd frontend && npm start

start_frontend_server:
	cd frontend/dist && python3 ../server.py

help:
	@echo "Available recipes:"
	@echo "make install_all                 - install backend and frontend dependencies"
	@echo "make install_backend             - install backend dependencies"
	@echo "make install_frontend            - install frontend dependencies"
	@echo "make create_db                   - create database tables"
	@echo "make clear_db                    - clear database tables"
	@echo "make build_frontend_dev          - build frontend for production"
	@echo "make build_frontend_dev          - build frontend for development"
	@echo "make start_backend_server        - start backend server"
	@echo "make start_frontend_server_dev   - start frontend server in development mode"
	@echo "make start_frontend_server       - start frontend server"
	@echo "make help                        - display this help message"
