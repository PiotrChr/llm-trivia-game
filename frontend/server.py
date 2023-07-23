# server.py
from flask import Flask, send_from_directory
import os
import webbrowser
from dotenv import load_dotenv

# Load .env file
load_dotenv()

app = Flask(__name__, static_folder='public/static/')


@app.route('/')
def serve():
    return send_from_directory('public', 'index.html')

@app.route('/<path:path>')
def serve_rest(path):
    return send_from_directory('public', 'index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('public/static/', path)

if __name__ == '__main__':
    PORT = int(os.getenv('FRONTEND_PORT', 8000))
    url = f"http://localhost:{PORT}"

    webbrowser.open(url)

    app.run(use_reloader=True, port=PORT, threaded=True)