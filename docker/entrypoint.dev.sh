#!/bin/bash

if [ "$DEBUG" = "1" ]; then
    echo "##### Installing DebugPy #####"

    pip install debugpy

    echo "##### Starting app in debug mode #####"
    cd backend && python -m debugpy --listen 0.0.0.0:5678 server.py
else
    echo "##### Starting app in normal mode #####"

    cd backend && gunicorn server:app --bind 0.0.0.0:5000 --worker-class geventwebsocket.gunicorn.workers.GeventWebSocketWorker --access-logfile access.log --error-logfile error.log
fi
