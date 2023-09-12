.DEFAULT_GOAL := help

.DEFAULT_START_CAT_ID:=0
START_CAT=$(DEFAULT_START_CAT_ID)
DEFAULT_LANG:=pl
LANG:=$(DEFAULT_LANG)

.PHONY: install_backend install_frontend create_db clear_db start_backend_server start_frontend_server start_frontend_server_dev build_frontend help install_all setup setup_db setup_env build_frontend_dev generate_manifest enable_service start_service stop_service status_service

install_all: install_backend install_frontend

setup: install_all remove_tables setup_db load_fixtures build_frontend_dev generate_manifest 

setup_env:
	python3 scripts/setup_env.py

deploy_dev:
	docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build -d

deploy_prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

install_common_deps:
	sudo apt-get update && sudo apt-get install -y python3-pip python3-venv python3-dev python3-wheel build-essential libssl-dev libffi-dev python3-setuptools
	curl -fsSL https://get.docker.com -o get-docker.sh
	sh get-docker.sh
	rm get-docker.sh
	sudo usermod -aG docker $${USER}
	# Optional: Install docker-compose
	sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$$(uname -s)-$$(uname -m)" -o /usr/local/bin/docker-compose
	sudo chmod +x /usr/local/bin/docker-compose

install_backend:
	pip3 install -r backend/requirements.txt

install_frontend:
	sudo apt-get install nodejs npm
	cd frontend && npm install

recreate_db: remove_tables setup_db load_fixtures

start_gunicorn_backend_live:
	cd backend && /home/pchrusciel/.local/bin/gunicorn server:app --bind 0.0.0.0:$(BACKEND_PORT) --worker-class geventwebsocket.gunicorn.workers.GeventWebSocketWorker

setup_db:
	python3 scripts/setup_db.py

clear_db:
	python3 backend/db/clear_tables.py

remove_tables:
	python3 backend/db/remove_tables.py

load_fixtures:
	python3 backend/db/load_fixtures.py

fetch_questions:
	cd backend && python3 fetch_questions.py --num_questions 50 --start_cat_id $(START_CAT)

translate_questions:
	cd backend && python3 translate_questions.py --language $(LANG) --cat $(CAT)

build_and_start: build_frontend start_frontend_server

build_frontend:
	cd frontend && npm run build

build_frontend_dev:
	cd frontend && npm run build_dev

generate_manifest:
	python3 scripts/generateManifest.py

start_backend_server:
	cd backend && python3 server.py

start_frontend_server_dev:
	cd frontend && npm start

start_frontend_server:
	cd frontend/public && python3 ../server.py

lint_js:
	cd frontend && npm run lint

format:
	cd frontend && npm run format

frontend_dev: format lint_js build_frontend_dev start_frontend_server

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
	@echo "  clear_db                - Clear the database tables"
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
