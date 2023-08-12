.PHONY: install_backend install_frontend create_db clear_db start_backend_server start_frontend_server start_frontend_server_dev build_frontend help install_all setup setup_db setup_env build_frontend_dev generate_manifest

default: help

install_all: install_backend install_frontend

setup: install_all remove_tables setup_db load_fixtures build_frontend_dev generate_manifest 

setup_env:
	python3 scripts/setup_env.py

install_backend:
	pip3 install -r backend/requirements.txt

install_frontend:
	cd frontend && npm install

recreate_db: remove_tables setup_db load_fixtures

setup_db:
	python3 scripts/setup_db.py

clear_db:
	python3 backend/db/clear_tables.py

remove_tables:
	python3 backend/db/remove_tables.py

load_fixtures:
	python3 backend/db/load_fixtures.py

build_and_start: build_frontend start_frontend_server

build_frontend:
	cd frontend && npm run build

build_frontend_dev:
	cd frontend && npm run build_dev

generate_manifest:
	python3 scripts/generateManifest.py

start_backend_server:
	cd backend && python3 app.py

start_frontend_server_dev:
	cd frontend && npm start

start_frontend_server:
	cd frontend/public && python3 ../server.py

lint_js:
	cd frontend && npm run lint

frontend_dev: lint_js build_frontend_dev start_frontend_server

tree:
	tree -f -I "node_modules|soft-ui-dashboard|category_images|bundle|__pycache_|assets" .

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

bash_frontend:
	docker compose exec frontend bash

bash_backend:
	docker compose exec backend bash

bash_frontend_debug:
	docker run -it --entrypoint /bin/sh llm-trivia-game-frontend:latest

help:
	@echo "Available recipes:"
	@echo "make install_all                 - install backend and frontend dependencies"
	@echo "make install_backend             - install backend dependencies"
	@echo "make install_frontend            - install frontend dependencies"
	@echo "make setup                       - setup the project including installation, database, and environment setup"
	@echo "make setup_env                   - setup environment variables"
	@echo "make recreate_db                 - recreate the database and load fixtures"
	@echo "make setup_db                    - create database tables"
	@echo "make clear_db                    - clear database tables"
	@echo "make remove_tables               - remove tables from the database"
	@echo "make load_fixtures               - load data fixtures into the database"
	@echo "make build_frontend              - build frontend for production"
	@echo "make build_frontend_dev          - build frontend for development"
	@echo "make generate_manifest           - generate project manifest"
	@echo "make start_backend_server        - start backend server"
	@echo "make start_frontend_server_dev   - start frontend server in development mode"
	@echo "make start_frontend_server       - start frontend server in production mode"
	@echo "make lint_js                     - lint JavaScript files"
	@echo "make frontend_dev                - lint, build and start frontend server for development"
	@echo "make help                        - display this help message"