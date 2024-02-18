#!/bin/bash

sqlite3 backend/db/db.sqlite .tables

cd backend && gunicorn server:app --bind 0.0.0.0:5000 --worker-class geventwebsocket.gunicorn.workers.GeventWebSocketWorker --access-logfile access.log --error-logfile error.log
