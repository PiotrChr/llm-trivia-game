.DEFAULT_GOAL := help

BACKEND_DIR = backend
FRONTEND_DIR = frontend

DEFAULT_START_CAT_ID:=0
START_CAT=$(DEFAULT_START_CAT_ID)
DEFAULT_LANG:=pl
LANG:=$(DEFAULT_LANG)

.PHONY: help install_all install_common_deps install_backend install_frontend \
        recreate_db setup_db remove_tables load_fixtures \
        build_and_start build_frontend build_frontend_dev start_backend_server \
        start_frontend_server_dev start_frontend_server lint_js format \
        frontend_dev tree build up down logs bash_frontend bash_backend \
        bash_frontend_debug enable_service start_service stop_service \
        status_service deploy_dev deploy_prod start_gunicorn_backend_live \
        fetch_questions translate_questions generate_manifest

# Installation
install_common_deps:
	sudo apt-get update && sudo apt-get install -y python3-pip python3-venv python3-dev python3-wheel build-essential libssl-dev libffi-dev python3-setuptools
	curl -fsSL https://get.docker.com -o get-docker.sh
	sh get-docker.sh
	rm get-docker.sh
	sudo usermod -aG docker $${USER}
	sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$$(uname -s)-$$(uname -m)" -o /usr/local/bin/docker-compose
	sudo chmod +x /usr/local/bin/docker-compose

install_backend:
	pip3 install -r $(BACKEND_DIR)/requirements.txt

install_frontend:
	sudo apt-get install nodejs npm
	(cd $(FRONTEND_DIR) && npm install)

install_all: install_backend install_frontend

# Database
setup_db:
	python3 scripts/setup_db.py

setup_env:
	python3 scripts/setup_env.py

remove_tables:
	python3 $(BACKEND_DIR)/db/remove_tables.py

load_fixtures:
	python3 $(BACKEND_DIR)/db/load_fixtures.py

recreate_db: remove_tables setup_db load_fixtures

# Frontend & Backend
build_frontend:
	(cd $(FRONTEND_DIR) && npm run build)

build_frontend_dev:
	(cd $(FRONTEND_DIR) && npm run build_dev)

start_backend_server:
	(cd $(BACKEND_DIR) && python3 server.py)

start_frontend_server_dev:
	(cd $(FRONTEND_DIR) && npm start)

start_frontend_server:
	(cd $(FRONTEND_DIR)/public && python3 ../server.py)

lint_js:
	(cd $(FRONTEND_DIR) && npm run lint)

format:
	(cd $(FRONTEND_DIR) && npm run format)

frontend_dev: format lint_js build_frontend_dev start_frontend_server

# Docker
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

# Deployment & Services
enable_service:
	sudo cp resources/services/llmtrivia-backend.service /etc/systemd/system/
	sudo systemctl daemon-reload
	sudo systemctl enable llmtrivia-backend.service

start_service:
	sudo systemctl start llmtrivia-backend.service

stop_service:
	sudo systemctl stop llmtrivia-backend.service

status_service:
	sudo systemctl status llmtrivia-backend.service

deploy_dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d

deploy_prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

start_gunicorn_backend_live:
	(cd $(BACKEND_DIR) && gunicorn server:app --bind 0.0.0.0:$(BACKEND_PORT) --worker-class geventwebsocket.gunicorn.workers.GeventWebSocketWorker)

fetch_questions:
	(cd $(BACKEND_DIR) && python3 fetch_questions.py --num_questions 20 --difficulty 1 --start_cat_id $(START_CAT))

translate_questions:
	(cd $(BACKEND_DIR) && python3 translate_questions.py --language $(LANG) --cat $(CAT))

generate_manifest:
	python3 scripts/generateManifest.py

setup: install_all remove_tables setup_db load_fixtures build_frontend_dev generate_manifest 

match-categories:
	screen -S cat_screen -dm bash -c "docker-compose exec backend python backend/matchCatIds.py backend/db/repaired.json backend/db/categorised.json"

# Help
help:
	@echo "Available recipes:"
	@echo "  install_all             - Install backend and frontend dependencies"
	@echo "  setup                   - Complete setup including building and loading fixtures"
	@echo "  setup_env               - Set up environment"
	@echo "  install_backend         - Install backend dependencies"
	@echo "  install_frontend        - Install frontend dependencies"
	@echo "  recreate_db             - Remove tables and set up the database again"
	@echo "  start_gunicorn_backend_live - Start the gunicorn backend for live environment"
	@echo "  setup_db                - Set up the database"
	@echo "  remove_tables           - Remove database tables"
	@echo "  load_fixtures           - Load fixtures into the database"
	@echo "  fetch_questions         - Fetch questions"
	@echo "  translate_questions     - Translate questions"
	@echo "  build_and_start         - Build frontend and start frontend server"
	@echo "  build_frontend          - Build the frontend"
	@echo "  build_frontend_dev      - Build frontend in development mode"
	@echo "  generate_manifest       - Generate manifest"
	@echo "  start_backend_server    - Start the backend server"
	@echo "  start_frontend_server_dev - Start frontend server in development mode"
	@echo "  start_frontend_server   - Start the frontend server"
	@echo "  lint_js                 - Lint JavaScript files"
	@echo "  format                  - Format files"
	@echo "  frontend_dev            - Frontend development tasks"
	@echo "  tree                    - Display project tree without specific directories"
	@echo "  build                   - Build docker compose services"
	@echo "  up                      - Start docker compose services"
	@echo "  down                    - Stop docker compose services"
	@echo "  logs                    - Show logs for docker compose services"
	@echo "  bash_frontend           - Bash into frontend docker service"
	@echo "  bash_backend            - Bash into backend docker service"
	@echo "  bash_frontend_debug     - Debug frontend docker service with bash"
	@echo "  enable_service          - Enable llmtrivia-backend systemd service"
	@echo "  start_service           - Start llmtrivia-backend systemd service"
	@echo "  stop_service            - Stop llmtrivia-backend systemd service"
	@echo "  status_service          - Show status of llmtrivia-backend systemd service"
	@echo "  deploy_dev              - Deploy services for development using Docker"
	@echo "  deploy_prod             - Deploy services for production using Docker"
