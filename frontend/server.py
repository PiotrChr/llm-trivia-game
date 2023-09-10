from flask import Flask, send_from_directory
import os
import webbrowser
from dotenv import load_dotenv

load_dotenv(dotenv_path='../../.frontend.env')

app = Flask(__name__, static_folder='public/static/')


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists("public/" + path):
        return send_from_directory('public', path)
    elif path.startswith("static/"):
        return send_from_directory('public/' + path)
    else:
        return send_from_directory('public', 'index.html')

if __name__ == '__main__':
    PORT = int(os.getenv('FRONTEND_PORT', 8000))
    url = f"http://localhost:{PORT}"

    # webbrowser.open(url)

    script_dir = os.path.dirname(os.path.realpath(__file__))

    app.run(
        host='0.0.0.0',
        use_reloader=False,
        port=PORT,
        threaded=True
    )