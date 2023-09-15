from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler

load_dotenv(dotenv_path='../.backend.env')

from app.route.player_routes import player_routes
from app.route.game_routes import game_routes
from app.route.question_routes import question_routes
from app.route.auth_routes import auth_routes
from app.route.language_routes import language_routes
from app.route.category_routes import category_routes
from app.route.game_socket import register_handlers
from utils.Database import Database



app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 2592000  # Refresh token expires after thirty days

jwt = JWTManager(app)
CORS(app, origins=[os.getenv('FRONTEND_HOST')], supports_credentials=True)
socketio = SocketIO(
    app,
    async_mode='gevent',
    cors_allowed_origins=os.getenv('FRONTEND_HOST', '*'),
    engineio_logger=True,
    logger=True,
    ping_timeout=600,
    ping_interval=15
)

app.extensions['socketio'] = socketio

@app.teardown_appcontext    
def close_db(e=None):
    Database.close()

register_handlers(socketio)

app.register_blueprint(player_routes, url_prefix='/api/players')
app.register_blueprint(game_routes, url_prefix='/api/game')
app.register_blueprint(question_routes, url_prefix='/api/questions')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(language_routes, url_prefix='/api/language')
app.register_blueprint(category_routes, url_prefix='/api/category')


if __name__ == '__main__':
    port = int(os.getenv('BACKEND_PORT', 9000))
    
    for rule in app.url_map.iter_rules():
        print(f"Endpoint: {rule.endpoint}, Route: {rule.rule}")

    http_server = WSGIServer(('0.0.0.0', port), app, handler_class=WebSocketHandler)
    http_server.serve_forever()